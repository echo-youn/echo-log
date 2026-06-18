# AWS OpenSearch Service 검색 엔진 도입 검토

AWS OpenSearch Service를 검색 엔진으로 도입할 때 검토한 용어, 클러스터 구성, 인덱스 설계, analyzer, 인덱싱 흐름, 애플리케이션 연동 방식에 대한 메모다.

원본 검토 문서의 이미지는 제외했다. 내부 프로젝트명, 담당자명, 실제 테이블명, 실제 서비스 prefix, 실제 게임명 등은 일반화했다.

## AWS OpenSearch는 Elasticsearch가 아니다

OpenSearch는 Elasticsearch 7.10.2와 Kibana 7.10.2에서 파생된 오픈소스 fork다.

API, DSL, 용어가 매우 유사하지만 fork 이후의 기능, 플러그인, API 상세, 클라이언트 호환성은 달라질 수 있다. 그래서 Elasticsearch 문서를 그대로 믿기보다는 OpenSearch 문서와 Amazon OpenSearch Service 문서를 우선 확인해야 한다.

팀 인프라가 대부분 AWS를 사용한다는 전제에서는 직접 OpenSearch 클러스터를 운영하기보다 AWS Managed Service인 Amazon OpenSearch Service를 우선 검토한다.

## 용어 및 개념

| 용어 | 내용 |
| --- | --- |
| Cluster | 하나 이상의 OpenSearch 노드 모음이다. 데이터를 저장하고 검색 요청을 처리할 때 하나의 서버처럼 동작한다. |
| Node | 클러스터를 구성하는 OpenSearch 단일 인스턴스다. 노드는 데이터 저장, 조정, 클러스터 관리 같은 역할을 나눠 수행한다. |
| Dedicated master node | 클러스터 내 다른 노드를 관리하고 cluster state를 유지한다. 데이터 저장과 검색 요청 처리는 하지 않는다. |
| Data node | 실제 데이터를 가진 노드다. 데이터 저장, 인덱싱, 검색 작업을 처리한다. |
| Index | 유사한 특성을 가진 document의 컬렉션이다. RDBMS의 table과 비슷하게 생각할 수 있지만 동일하지는 않다. |
| Document | 데이터를 저장하는 최소 단위다. OpenSearch에서는 JSON 형태로 직렬화되어 저장된다. |
| Field | Document의 구성 요소다. 각 필드는 `keyword`, `text`, `boolean`, `date`, `integer`, `long` 같은 타입을 가진다. |
| Mapping | 인덱스의 field 구조, 데이터 타입, 인덱싱 옵션을 정의한다. |
| Analyzer | 인덱싱과 검색 시 텍스트를 처리하는 도구다. tokenizer와 token filter 조합으로 구성된다. |
| Alias | 하나 이상의 인덱스를 가리키는 포인터다. 인덱스 버전 교체와 무중단 재색인에 유용하다. |
| Shard | 인덱스를 나눈 물리적 단위다. 각 shard는 인덱스에 있는 document의 부분 집합을 저장한다. |
| Replica | primary shard의 복제본이다. 장애 대응과 읽기 처리량 개선에 사용된다. |

## Field 타입

주로 사용하는 타입은 다음과 같다.

| 타입 | 용도 |
| --- | --- |
| `keyword` | 이름, ID, enum, 상태값처럼 분석 없이 정확한 값으로 저장하고 필터링/정렬/집계할 필드 |
| `text` | 토큰화와 형태소 분석이 필요한 전문 검색 대상 필드 |
| `boolean` | true/false 조건 |
| `date` | 날짜, 시각 조건과 정렬 |
| `integer`, `long`, `float`, `double` | 숫자 조건과 정렬 |
| `nested` | 배열 안의 객체 관계를 보존해야 하는 필드 |
| `object` | 단순 JSON object 필드. 배열 객체의 관계 보존이 필요하면 `nested`를 사용한다. |

`text`와 `keyword`는 목적이 다르다.

- 검색어를 분석해서 부분 일치, 형태소 검색, 유사 검색을 해야 하면 `text`를 쓴다.
- 필터링, 정렬, 집계, 정확한 일치를 해야 하면 `keyword`를 쓴다.

하나의 필드를 두 방식으로 모두 써야 하면 multi-field를 둔다.

```json
{
  "appName": {
    "type": "text",
    "analyzer": "service_ngram_analyzer",
    "fields": {
      "keyword": {
        "type": "keyword",
        "ignore_above": 256
      }
    }
  }
}
```

## Shard와 Replica

OpenSearch는 인덱스를 shard로 분할한다. 각 shard는 primary shard 또는 replica shard가 될 수 있다.

예를 들어 데이터 노드가 3개인 클러스터에 인덱스 하나를 다음처럼 만든다고 가정한다.

- primary shard: 5개
- replica: 1개

그러면 primary shard 5개와 replica shard 5개가 만들어져 총 shard 수는 10개가 된다. OpenSearch는 같은 primary shard와 그 replica shard가 같은 노드에 배치되지 않도록 분산한다.

검색 요청은 shard 단위로 실행된다. shard가 너무 많으면 검색 요청이 여러 shard로 흩어지고 CPU와 coordination 비용이 커질 수 있다. 반대로 shard가 너무 크면 재배치, 복구, 병렬 검색에서 부담이 생긴다.

Amazon OpenSearch Service 운영 가이드 기준으로 검색 워크로드는 shard당 10-30 GiB, 로그 워크로드는 30-50 GiB 정도를 권장한다. 50 GiB는 최대치로 보고 성장 여유를 둔다.

이번 검색 대상은 전체 데이터가 작고 검색 조건이 제한적이라는 전제이므로 primary shard는 1개로 시작한다.

## Master Node 설정

Amazon OpenSearch Service에서는 production domain에 dedicated master node 3개를 권장한다. master node는 cluster state, index, shard, node 상태를 관리한다.

인스턴스 타입은 노드 수와 shard 수를 기준으로 결정한다. AWS 문서의 dedicated master node sizing 표를 기준으로 보면, 작은 규모의 클러스터에서는 8 GiB RAM 계열이 출발점이 된다.

| 기준 | 권장 방향 |
| --- | --- |
| master node 수 | production은 3개 권장 |
| master node 역할 | data 저장과 검색 요청 처리는 하지 않음 |
| 작은 규모의 시작점 | `m6g.large.search`, `m5.large.search` 계열 검토 |
| 확장 기준 | node 수, index 수, shard 수, field mapping 수가 늘어나면 더 큰 타입 검토 |

## Data Node와 Index 설정

초기 설정은 다음 기준으로 잡는다.

| 항목 | 설정 | 설명 |
| --- | --- | --- |
| primary shard | `1` | 전체 데이터가 작고 분산 검색이 필요 없다는 전제 |
| replica | `1` | primary shard가 있는 data node 장애 시 가용성을 확보 |
| refresh interval | `60s` | 검색 결과의 즉시성이 중요하지 않으므로 indexing 부담을 낮춤 |
| replication type | `SEGMENT` | write load가 있고 refresh delay를 허용할 수 있으면 리소스 절약을 기대할 수 있음 |

OpenSearch의 `index.refresh_interval` 기본값은 `1s`다. Amazon OpenSearch Service 가이드에서도 indexing 성능을 위해 가능한 경우 30초 이상으로 늘리는 것을 권장한다. 이번 케이스는 실시간 검색 반영이 필수는 아니므로 `60s`로 둔다.

Segment replication은 기존 index에 바로 켤 수 없고 reindex가 필요하다. 또한 read-after-write 보장이 필요한 API에는 제약이 있으므로 서비스 요구사항과 버전 지원 여부를 먼저 확인해야 한다.

## 적용 서비스 요구사항

검색엔진 적용 대상은 다음과 같이 일반화한다.

| 서비스 | 요구사항 |
| --- | --- |
| Admin application | 관리 콘솔에서 앱, API 점검, 앱 메인 적용 이력 등을 조건 검색하고 페이징한다. |
| User application | 홈페이지 또는 유저 앱에서 앱 목록을 조건 검색하고 페이징한다. |

데이터 특성은 다음과 같다.

| 지표 | User application | Admin application |
| --- | --- | --- |
| 업데이트가 빈번한가? | 아니오 | 아니오 |
| 검색 인덱스의 실시간 업데이트가 필요한가? | 아니오 | 아니오 |
| 검색 데이터의 양이 방대한가? | 아니오 | 50만 건 이내 가정 |

이 기준이면 복잡한 실시간 색인보다 주기적 색인과 명시적 재색인을 중심으로 잡는 편이 단순하다.

## 원본 테이블 및 컬럼

테이블명은 일반화했다. 페이징을 위해서는 정렬 기준과 필터 조건을 명확히 알아야 한다.

초기 검토에서는 OpenSearch Scroll API를 페이징에 사용하는 안을 고려했다. 다만 사용자 화면의 일반 페이지네이션에는 Scroll API보다 `search_after`, 깊은 페이지네이션에는 PIT(Point in Time) + `search_after`가 더 적합하다. Scroll은 대량 export나 batch scan 성격에 더 가깝게 둔다.

### apps

| 용도 | 컬럼 |
| --- | --- |
| sorting | `appId`, `uid`, `appName.keyword`, `service`, `userUpdateDate`, `employeeUpdateDate`, `deletedDate` |
| filtering | `game.gameName`, `game.gameId`, `uid`, `appName`, `appEnv.url`, `type`, `blocked`, `partner` |

### api_maintenances

| 용도 | 컬럼 |
| --- | --- |
| sorting | `apiMaintenanceId` |
| filtering | `game.gameName`, `category.categoryName`, `httpMethod`, `path`, `summary`, `state`, `updateEmployeeNo` |

### app_main_apply_histories

| 용도 | 컬럼 |
| --- | --- |
| sorting | `appMainApplyHistoryId`, `createUser`, `appName.keyword`, `curationAppEnv.url.keyword`, `app.game.gameName.keyword`, `userCreateDate` |
| filtering | `status`, `app.game.gameId`, `createUser`, `appName`, `curationAppEnv.url`, `app.partner`, `app.blocked` |

## 인덱스 및 Alias 설계

검색엔진 검색 결과만으로 응답을 제공할 수 있도록 인덱스 스키마를 만든다. RDBMS의 covering index를 생각하면 이해하기 쉽다.

검색 결과 화면에 필요한 값은 document 안에 넣는다. 반대로 검색, 정렬, 필터링, 응답에 필요 없는 데이터는 넣지 않거나 `index: false`로 둔다.

join이 필요한 데이터는 OpenSearch 검색 시 join하지 말고 document에 denormalize한다. 예를 들어 앱이 게임 정보를 기준으로 검색되어야 한다면 앱 document 안에 필요한 게임 필드를 nested 또는 object로 함께 저장한다.

`nested`와 `object`는 결과가 다르다. 객체 배열에서 각 객체의 필드 관계를 보존해야 하면 `nested`를 쓴다. 단순 구조이거나 배열 객체 간 관계가 중요하지 않으면 `object`를 사용할 수 있다.

## Analyzer 설계

필드에 사용하는 analyzer는 다음 4종류를 기준으로 한다.

| analyzer | 특징 |
| --- | --- |
| `standard` | `text` 데이터 타입의 기본 분석기 |
| `keyword` | `keyword` 데이터 타입의 기본 분석기 |
| `service_korean_analyzer` | `nori_tokenizer`를 사용하는 커스텀 한국어 분석기 |
| `service_ngram_analyzer` | `ngram` tokenizer를 사용하는 커스텀 부분 검색 분석기 |

앱명처럼 사용자가 임의로 만든 고유명사는 형태소 분석보다 n-gram이 더 잘 맞을 때가 있다. 설명문처럼 일반 한국어 문장에 가까운 필드는 nori를 검토한다.

## apps 인덱스

```json
PUT apps_v1
{
  "aliases": {
    "alias_apps": {}
  },
  "settings": {
    "index": {
      "replication.type": "SEGMENT",
      "refresh_interval": "60s",
      "number_of_shards": 1,
      "number_of_replicas": 1
    },
    "analysis": {
      "analyzer": {
        "service_ngram_analyzer": {
          "type": "custom",
          "tokenizer": "service_ngram_tokenizer"
        },
        "service_korean_analyzer": {
          "type": "custom",
          "tokenizer": "service_korean_tokenizer",
          "filter": ["nori_part_of_speech", "nori_readingform"]
        }
      },
      "tokenizer": {
        "service_ngram_tokenizer": {
          "type": "ngram",
          "min_gram": 2,
          "max_gram": 2,
          "token_chars": ["letter", "digit"]
        },
        "service_korean_tokenizer": {
          "type": "nori_tokenizer",
          "decompound_mode": "none"
        }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "appId": {
        "type": "long"
      },
      "appDescription": {
        "type": "text",
        "analyzer": "service_korean_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "appEnv": {
        "type": "nested",
        "properties": {
          "appEnvId": {
            "type": "long"
          },
          "url": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      },
      "appName": {
        "type": "text",
        "analyzer": "service_ngram_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "deleted": {
        "type": "boolean"
      },
      "languageCode": {
        "type": "keyword"
      },
      "uid": {
        "type": "keyword"
      },
      "userCreateDate": {
        "type": "date"
      },
      "userUpdateDate": {
        "type": "date"
      },
      "employeeUpdateDate": {
        "type": "date"
      },
      "deletedDate": {
        "type": "date"
      },
      "game": {
        "type": "nested",
        "properties": {
          "gameId": {
            "type": "keyword"
          },
          "gameName": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      },
      "service": {
        "type": "keyword"
      },
      "type": {
        "type": "keyword"
      },
      "blocked": {
        "type": "boolean"
      },
      "partner": {
        "type": "boolean"
      },
      "employeeUpdateNo": {
        "type": "keyword",
        "index": false
      }
    }
  }
}
```

## api_maintenances 인덱스

```json
PUT api_maintenances_v1
{
  "aliases": {
    "alias_api_maintenances": {}
  },
  "settings": {
    "index": {
      "replication.type": "SEGMENT",
      "refresh_interval": "60s",
      "number_of_shards": 1,
      "number_of_replicas": 1
    },
    "analysis": {
      "analyzer": {
        "service_ngram_analyzer": {
          "type": "custom",
          "tokenizer": "service_ngram_tokenizer"
        }
      },
      "tokenizer": {
        "service_ngram_tokenizer": {
          "type": "ngram",
          "min_gram": 2,
          "max_gram": 2,
          "token_chars": ["letter", "digit"]
        }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "apiMaintenanceId": {
        "type": "long"
      },
      "game": {
        "type": "nested",
        "properties": {
          "gameId": {
            "type": "keyword"
          },
          "gameName": {
            "type": "text",
            "analyzer": "service_ngram_analyzer",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      },
      "httpMethod": {
        "type": "keyword"
      },
      "category": {
        "type": "nested",
        "properties": {
          "categoryId": {
            "type": "integer"
          },
          "categoryName": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      },
      "path": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 512
          }
        }
      },
      "summary": {
        "type": "text",
        "analyzer": "service_ngram_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "state": {
        "type": "keyword"
      },
      "updateEmployeeNo": {
        "type": "keyword"
      }
    }
  }
}
```

## app_main_apply_histories 인덱스

```json
PUT app_main_apply_histories_v1
{
  "aliases": {
    "alias_app_main_apply_histories": {}
  },
  "settings": {
    "index": {
      "replication.type": "SEGMENT",
      "refresh_interval": "60s",
      "number_of_shards": 1,
      "number_of_replicas": 1
    },
    "analysis": {
      "analyzer": {
        "service_ngram_analyzer": {
          "type": "custom",
          "tokenizer": "service_ngram_tokenizer"
        }
      },
      "tokenizer": {
        "service_ngram_tokenizer": {
          "type": "ngram",
          "min_gram": 2,
          "max_gram": 2,
          "token_chars": ["letter", "digit"]
        }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "appMainApplyHistoryId": {
        "type": "long"
      },
      "curationAppEnv": {
        "type": "nested",
        "properties": {
          "curationAppEnvId": {
            "type": "long"
          },
          "url": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      },
      "appName": {
        "type": "text",
        "analyzer": "service_ngram_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "app": {
        "type": "nested",
        "properties": {
          "partner": {
            "type": "boolean"
          },
          "blocked": {
            "type": "boolean"
          },
          "game": {
            "type": "nested",
            "properties": {
              "gameId": {
                "type": "keyword"
              },
              "gameName": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              }
            }
          }
        }
      },
      "status": {
        "type": "keyword"
      },
      "userCreateDate": {
        "type": "date"
      },
      "createUser": {
        "type": "keyword"
      }
    }
  }
}
```

## Index 설정 이유

| 설정 | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `index.replication.type` | `SEGMENT` | `DOCUMENT` | replica 생성 방식이다. segment replication은 지연을 일부 허용할 수 있는 쓰기 중심 워크로드에서 CPU와 메모리 이점을 기대할 수 있다. 단, 버전 지원과 read-after-write 제약을 확인해야 한다. |
| `index.refresh_interval` | `60s` | `1s` | refresh 주기를 늘리면 검색 반영은 늦어지지만 indexing 성능에는 유리하다. 검색 반영 지연을 허용할 수 있어 60초로 둔다. |
| `index.number_of_shards` | `1` | `1` | 인덱싱할 데이터가 작고 분산 검색 필요성이 낮아 1개로 둔다. |
| `index.number_of_replicas` | `1` | `1` | primary shard가 있는 data node 장애에 대비해 replica를 1개 둔다. |

## 인덱싱 및 검색 흐름

저장소는 다음 세 가지로 본다.

| 저장소 | 역할 |
| --- | --- |
| RDBMS | 원본 데이터 저장소 |
| OpenSearch | 검색용 denormalized document 저장소 |
| Redis | 검색 결과 캐시 |

## 인덱싱 종류

| 종류 | 설명 | 갱신 주기 |
| --- | --- | --- |
| real-time index | 데이터 추가, 수정, 삭제 시 변경 document를 OpenSearch에 반영한다. | 실시간 |
| minor index | 특정 주기 동안 발생한 변경사항을 OpenSearch에 반영한다. | 매일 또는 운영 정책 |
| major index | mapping 변경 또는 전체 데이터 재구성이 필요할 때 전체 인덱스를 새로 만든다. | 수동 실행 |

## 아키텍처 후보

### 직접 통합 방식

```text
Backend application <-> OpenSearch
```

| 구분 | 내용 |
| --- | --- |
| 설명 | 백엔드 애플리케이션이 데이터 인덱싱과 검색을 위해 OpenSearch와 직접 통신한다. |
| 장점 | 추가 구성 요소가 없어서 단순하다. OpenSearch에 직접 접근하므로 레이턴시가 낮다. |
| 단점 | 백엔드 서버에 색인 부하가 붙는다. 인덱싱 모듈 장애가 서비스 장애로 번질 수 있다. |

### 이벤트 스트리밍 방식

```text
Backend application -> Message queue -> Indexer -> OpenSearch
```

| 구분 | 내용 |
| --- | --- |
| 설명 | 데이터 변경 시 메시지 큐에 인덱스 업데이트 이벤트를 발행하고, 별도 consumer가 OpenSearch에 반영한다. |
| 장점 | 여러 서비스에서 변경 이벤트를 사용할 수 있어 확장성이 좋다. 색인 작업이 일시 중단되어도 큐에 버퍼링할 수 있다. |
| 단점 | 운영 및 관리 포인트가 늘어난다. 메시지 순서, 중복, 재처리, DLQ를 고려해야 한다. |

초기 구조는 이벤트 스트리밍 방식을 검토한다. 다만 minor/major reindex처럼 시작과 종료가 명확해야 하는 작업은 큐의 종료 시점을 알기 어렵기 때문에 batch에서 직접 처리하는 쪽이 더 단순하다.

## 권장 흐름

### 검색

검색 응답은 OpenSearch document만으로 구성한다.

```text
Client
  -> Backend
  -> Redis cache lookup
  -> OpenSearch alias search
  -> Redis cache put
  -> Client
```

RDBMS 재조회 없이 응답할 수 있도록 document를 설계한다. 그래야 검색 API가 RDBMS join 비용에 다시 묶이지 않는다.

### Minor index

매일 또는 특정 주기로 변경분을 반영한다.

```text
Batch scheduler
  -> RDBMS changed rows query
  -> OpenSearch bulk update/index/delete
  -> Redis cache eviction
```

검색 정확도가 조금 늦게 따라와도 되는 서비스라면 이 방식이 단순하다.

### Major index

mapping 변경 또는 전체 재색인이 필요하면 새 인덱스를 만들고 alias를 교체한다.

```text
1. apps_v2 생성
2. RDBMS 전체 데이터 조회
3. apps_v2 bulk index
4. 검증
5. alias_apps를 apps_v1에서 apps_v2로 교체
6. Redis cache eviction
7. 이전 인덱스 보관 후 삭제
```

alias 교체 예시는 다음과 같다.

```json
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "apps_v1",
        "alias": "alias_apps"
      }
    },
    {
      "add": {
        "index": "apps_v2",
        "alias": "alias_apps"
      }
    }
  ]
}
```

alias를 검색 API의 대상으로 사용하면 인덱스 버전을 교체해도 애플리케이션 코드는 바뀌지 않는다.

### Real-time index

능동적 변경 감지는 다음 구조로 구현할 수 있다.

```text
Application transaction
  -> RDBMS write
  -> outbox/event publish
  -> message queue
  -> index consumer
  -> OpenSearch update
  -> Redis cache eviction
```

이번 도입에서는 모든 변경을 실시간으로 처리하지 않는다. 웹앱은 데이터를 검색해 서빙하는 역할에 집중하고, 인덱스 신선도는 batch와 필요 시 이벤트 기반 반영으로 맞춘다.

수동적 변경 감지, 예를 들어 애플리케이션이 조회 시점마다 RDBMS와 OpenSearch를 비교해 보정하는 방식은 이번 범위에서 제외한다.

## 페이지네이션

초기 검토에서는 Scroll API를 페이징 처리 후보로 두었다. 현재 권장안은 다음과 같이 나눈다.

| 방식 | 용도 | 비고 |
| --- | --- | --- |
| `from` + `size` | 얕은 페이지네이션 | 단순하지만 deep pagination에는 부적합 |
| Scroll API | 대량 export, batch scan | 사용자 화면 페이지네이션보다는 전체 순회에 적합 |
| `search_after` | 커서 기반 다음 페이지 | 정렬 기준과 tie-breaker가 필요 |
| PIT + `search_after` | 일관성이 필요한 deep pagination | OpenSearch가 권장하는 깊은 페이지네이션 방식 |

검색 UI에서 페이지 이동이 필요하면 안정적인 정렬 기준을 반드시 둔다. 예를 들어 `appName.keyword asc`, `appId asc`처럼 tie-breaker를 함께 넣는다.

```json
GET alias_apps/_search
{
  "size": 20,
  "query": {
    "bool": {
      "filter": [
        { "term": { "game.gameId": "1001" } },
        { "term": { "blocked": false } }
      ],
      "must": [
        { "match": { "appName": "검색어" } }
      ]
    }
  },
  "sort": [
    { "appName.keyword": "asc" },
    { "appId": "asc" }
  ],
  "search_after": ["검색결과마지막앱명", 12345]
}
```

## Redis 키 설계

검색 엔진의 부하를 줄이기 위해 검색 결과를 캐싱한다. 예상 부하는 페이지 이동, 랜딩 페이지 새로고침, 같은 조건 반복 조회에서 발생한다.

검색 쿼리의 의미가 같으면 같은 키가 나오도록 정렬 조건과 필터 조건을 정규화한다.

예시 질의:

| 질의 파라미터 | 값 |
| --- | --- |
| cursor | `2` |
| sort | `appName asc` |
| gameId | `1001` |
| appEnv.url | `sample-url` |

Redis 키:

| Prefix | 캐시명 | 캐시 키 | 전체 키 |
| --- | --- | --- | --- |
| `SEARCH` | `APPS` | `2_appName_asc_1001_sample-url` | `SEARCH:APPS:2_appName_asc_1001_sample-url` |

운영에서는 단순 문자열 연결보다 canonical JSON을 만든 뒤 hash하는 방식이 더 안전하다.

```text
SEARCH:APPS:sha256(<canonical-query-json>)
```

캐시 무효화는 major/minor/real-time index 반영 시점에 함께 수행한다. 범위 무효화가 필요하면 prefix version을 둔다.

```text
SEARCH:APPS:v3:<hash>
```

## n-gram analyzer

n-gram은 텍스트를 연속된 n개의 문자 조각으로 나누는 방식이다. 검색 엔진에서는 부분 검색이나 자동완성에 자주 사용한다.

예를 들어 `"피파온라인"`을 1-gram으로 자르면 다음과 같다.

```text
피, 파, 온, 라, 인
```

2-gram으로 자르면 다음과 같다.

```text
피파, 파온, 온라, 라인
```

2-3 gram으로 자르면 다음과 같다.

```text
피파, 피파온, 파온, 파온라, 온라, 온라인, 라인
```

OpenSearch `_analyze` API로 확인할 수 있다.

```json
GET _analyze
{
  "text": "피파온라인",
  "tokenizer": {
    "type": "ngram",
    "min_gram": 2,
    "max_gram": 2,
    "token_chars": ["letter", "digit"]
  }
}
```

응답 예시는 다음과 같다.

```json
{
  "tokens": [
    {
      "token": "피파",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "파온",
      "start_offset": 1,
      "end_offset": 3,
      "type": "word",
      "position": 1
    },
    {
      "token": "온라",
      "start_offset": 2,
      "end_offset": 4,
      "type": "word",
      "position": 2
    },
    {
      "token": "라인",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 3
    }
  ]
}
```

앱 이름처럼 고유명사, 축약어, 사용자 생성 단어가 많은 필드에는 n-gram이 효과적이다. 다만 토큰 수가 많아져 index size와 indexing 비용이 커질 수 있으므로 `min_gram`, `max_gram`을 작게 시작한다.

## 한국어 형태소 분석기 nori

형태소는 언어에서 실제 의미를 담고 있는 가장 작은 단위다.

예를 들어 `"짝사랑을 한다"`를 형태소로 나누면 다음처럼 볼 수 있다.

| 형태소 | 품사 | 품사명 |
| --- | --- | --- |
| 짝 | `NNG` | 일반 명사 |
| 사랑 | `NNG` | 일반 명사 |
| 을 | `JKO` | 목적격 조사 |
| 하 | `VV` | 동사 |
| ㄴ다 | `EC` | 연결 어미 |

보통 `"을"`, `"ㄴ다"` 같은 조사나 어미로 검색하지 않으므로 이런 품사는 필터링한다.

한국어 분석기로는 nori를 검토한다. AWS OpenSearch Service는 OpenSearch 버전에 따라 Nori Analysis plugin을 optional package로 지원한다. Console에서 domain의 Packages 탭에 들어가 호환되는 `analysis-nori` 패키지를 연결할 수 있다.

패키지 연결은 blue/green deployment를 유발할 수 있으므로 운영 도메인에서는 적용 시간을 잡아야 한다.

## nori analyzer 생성

인덱스에 nori 분석기를 사용하는 예시다.

| 옵션 | 설명 |
| --- | --- |
| `decompound_mode` | 합성어 분리 여부. `none`, `discard`, `mixed` |
| `nori_part_of_speech` | 선택한 품사를 제거하는 token filter |
| `nori_readingform` | 한자어를 한글 음으로 변경하는 token filter |

```json
PUT apps_nori
{
  "settings": {
    "analysis": {
      "analyzer": {
        "service_korean_analyzer": {
          "type": "custom",
          "tokenizer": "service_korean_tokenizer",
          "filter": ["nori_part_of_speech", "nori_readingform"]
        }
      },
      "tokenizer": {
        "service_korean_tokenizer": {
          "type": "nori_tokenizer",
          "decompound_mode": "none"
        }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "_class": {
        "type": "keyword",
        "index": false
      },
      "appDescription": {
        "type": "text",
        "analyzer": "service_korean_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "appName": {
        "type": "text",
        "analyzer": "service_korean_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "id": {
        "type": "long"
      },
      "uid": {
        "type": "keyword"
      }
    }
  }
}
```

분석 테스트:

```json
GET _analyze
{
  "text": "동해물과 백두산이 마르고 닳도록",
  "tokenizer": {
    "type": "nori_tokenizer"
  }
}
```

응답 예시는 다음과 같다.

```json
{
  "tokens": [
    {
      "token": "동해",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "물",
      "start_offset": 2,
      "end_offset": 3,
      "type": "word",
      "position": 1
    },
    {
      "token": "과",
      "start_offset": 3,
      "end_offset": 4,
      "type": "word",
      "position": 2
    },
    {
      "token": "백두",
      "start_offset": 5,
      "end_offset": 7,
      "type": "word",
      "position": 3
    },
    {
      "token": "산",
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 4
    },
    {
      "token": "이",
      "start_offset": 8,
      "end_offset": 9,
      "type": "word",
      "position": 5
    },
    {
      "token": "마르",
      "start_offset": 10,
      "end_offset": 12,
      "type": "word",
      "position": 6
    },
    {
      "token": "고",
      "start_offset": 12,
      "end_offset": 13,
      "type": "word",
      "position": 7
    },
    {
      "token": "닳",
      "start_offset": 14,
      "end_offset": 15,
      "type": "word",
      "position": 8
    },
    {
      "token": "도록",
      "start_offset": 15,
      "end_offset": 17,
      "type": "word",
      "position": 9
    }
  ]
}
```

우리 서비스의 앱명은 사용자가 창의적으로 만드는 고유명사가 많다. 예를 들어 일반 사전에 없는 합성어, 약어, 커뮤니티식 표현이 많다면 nori보다 n-gram이 검색 품질에 더 유리할 수 있다. 그래서 앱명은 n-gram, 설명문은 nori를 기본 후보로 둔다.

## Spring Data OpenSearch

Java/Spring 기반 프로젝트라면 Spring Data OpenSearch를 사용할 수 있다.

Spring Data OpenSearch는 Spring Data Elasticsearch 위에 만들어진 OpenSearch 통합 프로젝트다. Repository 스타일 접근, object mapping, operations API를 사용할 수 있다.

| 기능 | 설명 |
| --- | --- |
| Client configuration | OpenSearch와 통신하는 REST client를 설정한다. Spring Boot auto configuration도 사용할 수 있다. |
| Object mapping | Java 객체와 OpenSearch document model을 매핑한다. |
| Operations | index, update, bulk index, bulk update, search 같은 저수준 작업을 다룬다. |
| Query | Native query, string query, criteria query, search template query 등을 사용할 수 있다. |
| Repository | Spring Data Repository 인터페이스를 제공한다. query method, projection, native query, SpEL expression을 사용할 수 있다. |

단순 CRUD 성격의 검색은 Repository로 시작할 수 있다. 하지만 nested query, bool query, search_after, PIT, aggregation처럼 검색 조건이 복잡하면 Operations 또는 OpenSearch Java client를 직접 쓰는 편이 더 명확할 수 있다.

## 구현 시 주의점

- alias를 기준으로 검색한다.
- index명에는 version을 붙인다. 예: `apps_v1`, `apps_v2`
- 검색 결과 응답에 필요한 필드는 document에 포함한다.
- 정렬 필드는 `keyword`, `date`, numeric 타입을 사용한다.
- `text` 필드로 정렬하지 않는다. 필요하면 `.keyword` multi-field를 둔다.
- mapping은 가능하면 `dynamic: strict`로 둔다.
- 검색과 응답에 필요 없는 필드는 저장하지 않거나 `index: false`로 둔다.
- nested 배열 조건은 반드시 `nested` query로 검색한다.
- bulk indexing 크기는 실제 데이터로 측정한다.
- major reindex 이후 alias 교체와 Redis cache eviction을 한 트랜잭션 흐름처럼 운영한다.
- OpenSearch와 Elasticsearch 문서가 충돌하면 OpenSearch와 AWS 문서를 우선한다.

## 정리

이번 검색 도입은 데이터 규모가 작고 실시간성이 강하지 않다. 따라서 초기 구성은 Managed OpenSearch Service, 1 primary shard, 1 replica, 60초 refresh interval, alias 기반 버전 교체가 적절하다.

앱명처럼 고유명사와 부분 검색이 중요한 필드는 n-gram을 우선 검토한다. 설명문처럼 자연어 문장에 가까운 필드는 nori를 검토한다.

사용자 화면의 페이징은 Scroll API보다 `search_after` 또는 PIT + `search_after`가 더 적합하다. Scroll API는 batch scan이나 export 용도로 남기는 편이 좋다.

real-time index는 이벤트 기반으로 확장할 수 있지만, 이번 범위에서는 batch 기반 minor/major index를 중심으로 단순하게 시작한다.

## References

- [Introducing OpenSearch](https://aws.amazon.com/blogs/opensource/introducing-opensearch/)
- [Dedicated master nodes in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-dedicatedmasternodes.html)
- [Operational best practices for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/bp.html)
- [Plugins by engine version in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-plugins.html)
- [Importing and managing packages in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/custom-packages.html)
- [OpenSearch index settings](https://docs.opensearch.org/latest/install-and-configure/configuring-opensearch/index-settings/)
- [OpenSearch segment replication](https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/segment-replication/index/)
- [OpenSearch n-gram tokenizer](https://docs.opensearch.org/latest/analyzers/tokenizers/ngram/)
- [OpenSearch object field type](https://docs.opensearch.org/latest/mappings/supported-field-types/object/)
- [OpenSearch nested field type](https://docs.opensearch.org/latest/mappings/supported-field-types/nested/)
- [OpenSearch pagination](https://docs.opensearch.org/latest/search-plugins/searching-data/paginate/)
- [OpenSearch Point in Time](https://docs.opensearch.org/latest/search-plugins/searching-data/point-in-time/)
- [Nori: The Official Elasticsearch Plugin for Korean Language Analysis](https://www.elastic.co/blog/nori-the-official-elasticsearch-plugin-for-korean-language-analysis)
- [Spring Data OpenSearch](https://github.com/opensearch-project/spring-data-opensearch)
- [Spring Data Elasticsearch Reference](https://docs.spring.io/spring-data/elasticsearch/reference/)
