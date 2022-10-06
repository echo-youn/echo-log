<style>
    .no-wrap {
        white-space: nowrap;
    }
</style>

# Mysql Query Execution Plan #1
Explain은  SELECT, UPDATE, INSERT 등 DML문의 쿼리 실행 계획을 미리보는 기능입니다. 이 기능을 사용하여 데이터 조회 시 더 빠르게 조회 할 수 있는 인덱스를 찾을 수 있도록 도움을 줍니다. 이 기능을 [공식 문서](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-output-columns)를 기반으로 간략하게 정리합니다.

# Explain
## Explain 결과 컬럼
```sql
DESC SELECT 1;
```
<div class="no-wrap">

|<nobr>id</nobr>|select_type|table|<nobr>partitions</nobr>|type|possible_keys|key|key_len|ref|rows|filtered|Extra|
|--|-----------|-----|----------|----|-------------|---|-------|---|----|--------|-----|
|1|SIMPLE|NULL|NULL|NULL|NULL|NULL|NULL|NULL|NULL|NULL|No tables used|

</div>
위에 조회된 컬럼들의 간략한 설명이다.

`JSON Name` 컬럼은 `FORMAT=JSON`으로 출력했을 때의 컬럼명이다. [공식문서 링크](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-output-columns)

<div class="no-wrap">

| **Column**        | **JSON Name** | **Meaning**                                    |**요약 설명**|
|-------------------|---------------|------------------------------------------------|-|
| [**id**](#id)            | select_id     | The SELECT identifier                          |SELEC의 식별자, 1부터 순서대로 실행된다.|
| [**select_type**](#select-type)   | None          | The SELECT type                                |SIMPLE, PRIMARY, UNION, DEPENDENT UNION, UNION RESULT, SUBQUERY, DEPENDENT SUBQUERY, DERIVED, DEPENDENT DERIVED, MATERIALIZED, UNCACHEABLE SUBQUERY, UNCACHEABLE UNION|
| **table**         | table_name    | The table for the output row                   |쿼리가 참조하는 테이블의 이름 또는 아래의 경우<br/><union **M**,**N**>유니언 되는 **M**, **N** 쿼리의 `id`<br/>\<derived **N**\> 파생테이블 **N**의 `id`. 예를 들어 FROM 절의 하위 쿼리.<br/>\<subquery**N**\> 구체화된 서브쿼리 **N** 의 `id`|
| **partitions**    | partitions    | The matching partitions                        |파티션 된 테이블일 경우 파티션 명|
| **type**          | access_type   | [The join type](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-join-types)                                  |조인 타입 (best to worst)<br/>system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL|
| **possible_keys** | possible_keys | The possible indexes to choose                 |선택할 수 있는 후보 키 또는 인덱스|
| **key**           | key           | The index actually chosen                      |실제로 선택된 키 또는 인덱스|
| **key_len**       | key_length    | The length of the chosen key                   |선택된 `key`의 길이|
| **ref**           | ref           | The columns compared to the index              |인덱스와 비교할 컬럼 또는 상수, 계산된 값이 경우 `func`|
| **rows**          | rows          | Estimate of rows to be examined                |쿼리 실행을 위해 확인해야할 행의 수|
| **filtered**      | filtered      | Percentage of rows filtered by table condition |필터링되고 남은 레코드의 비율|
| **Extra**         | None          | [Additional information  ](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-extra-information)                       |추가 정보<br/>쿼리를 최대한 빠르게하기 위해서 피해야하는 값<br/>`Using filesort`, `Using temporary`|

</div>

## type
`type` 컬럼은 테이블들이 어떻게 조인되어 있는지 설명해 주는 컬럼이다. 우선 조인 타입들의 Best 부터 Worst까지 나열한 뒤 각각 항목에 대해 살펴본다.

<div class="no-wrap"no-wrap>
system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL
</div>

- system
  
  테이블에 하나의 행 밖에 없는 경우(= system table). `const` 타입중 특별한 케이스로 분류된다.

- const

  쿼리를 시작 했을 때 결과가 한개만 있는 경우. 테이블에 하나밖에 없기 때문에 매우 빠르다. Primary key 또는 unique 인덱스의 모든 부분을 상수 값과 비교할때 사용된다.

- eq_ref
  
  두 테이블을 조인할 때 가장 많이 보이는 타입입니다. 조인할때 Primary 혹은 Unique NOT NULL 인덱스의 모든 부분을 사용할 때 사용됩니다. 이때 사용되는 연산자는 `=` 입니다. 이전 테이블의 행 조합에 대해 조인하는 테이블의 행 하나와 연결되면 eq_ref이다.

- ref

  두 테이블을 조인할 때 Primary Key 또는 Unique 인덱스가 아닌 것으로 비교하는 조인타입 입니다. 조인되는(LEFT) 테이블과 조인하는 테이블의 인덱스와 일치하는 경우이다.

- fulltext (여기서부터는 튜닝이 필요 할 수 있음)

  `FULLTEXT` 인덱스로 조인하는 경우이다.

- ref_or_null

  `ref` 타입과 비슷하지만 NULL을 포함해서 검색해야하는 경우이다. 이 타입의 경우 종종 하위쿼리를 최적화해야하는 경우가 있다.

- index_merge
  
  인덱스 Merge 최적화가 사용된 조인 타입이다.

- unique_subquery
  
  이 조인 타입은 IN절의 하위쿼리에 대한 `eq_ref`입니다.

- index_subquery

  이 조인 타입은 `unique_subquery`와 비슷하지만 IN절 하위 쿼리의 값이 고유값이 아닐때 사용된다.

- range

  인덱스를 사용하여 검색한 범위만큼만 조인하는 조인 타입이다. 이 타입일때 `key` 컬럼에는 사용된 인덱스가 출력된다. 그리고 `key_len`에는 사용된 키 중 가장 긴 길이가 출력된다. 이 경우 `ref`컬럼은 NULL 이다.

- index

  이 조인 타입은 `ALL` 타입과 거의 유사하다. 다른점은 인덱스 트리만 스캔한다. `Extra` 컬럼에 `Using index`가 표시되는 경우 쿼리가 커버링 인덱스가 되기 충분한 조건일때 인덱스 스캔만 되는 경우이다. `Extra`에 표시 되지 않는 경우는 인덱스의 모든 테이블을 스캔하는 경우이다.

- ALL

  테이블 전체를 스캔하는 스캔 방식이다. 쿼리의 튜닝이 필요하다.
## possible_keys

MySQL이 테이블에서 스캔하기 위해 선택할 수 있는 인덱스이다. 만약 이 컬럼이 NULL이라면 사용할 수 있는 인덱스가 없는 것이다.

## key

MySQL이 실제로 사용하기로 결정한 키(인덱스)다. `possible_keys`에 없는 키(인덱스)가 선택될 수도 있다. 만약 `possible_keys`에 있는 키를 사용하게 하려면 `FORCE INDEX`, `USE INDEX`, `IGNORE INDEX`를 사용하면 된다.

## key_len

MySQL이 사용하기로 한 키의 길이를 나타낸다.

## ref

테이블에서 조회하귀 위해 사용된 컬럼 또는 상수의 인덱스명을 보여준다. 만약 이 값이 `func`라면 함수에 의해 결정된 것이다.

## rows

MySQL이 쿼리를 실행하기 위해 검사해야 한다고 생각하는 행의 수이다. 실제 검색하는 수와 다를 수 있다.

## filtered

이 열은 테이블 조건으로 필터링된 결과와의 비율을 보여준다. 최대 100%이며, 필터링 되고 남은 행의 비율을 보여준다.

## Extra

이 컬럼은 추가적인 정보를 보여주는 컬럼이다. [공식문서 5.8](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-extra-information)

아래에선 일부만 발췌하여 보여준다.

- Using filesort

  MySQL이 정렬하기 위해서 추가적인 작업을 수행해야 하는 경우이다. 많은 행을 읽기때문에 쿼리 최적화가 필요하다.
  
- Using temporary

  Mysql이 반드시 임시테이블을 생성해야하는 경우이다. 일반적으로 쿼리에 컬럼이 다른 Group By와 Order By가 포함된 경우 발생한다.

- Using Index(커버링 인덱스)

  데이터 파일을 전혀 읽지 않고 인덱스만 읽어서 쿼리를 모두 처리할 수 있을 때 표시된다. 이 전략은 쿼리가 단일 인덱스를 사용하는 경우만 가능하다.

- Using index condition

  테이블을 인덱스로 먼저 스캔하고 전체 테이블을 스캔할지 여부를 결정하기 위해 테스트를 합니다. 이 경우, 풀스캔이 필요한 경우가 아니면 [푸시 다운](https://dev.mysql.com/doc/refman/8.0/en/index-condition-pushdown-optimization.html) 할 필요가 있습니다.

- Using where

  다음 테이블과 정확히 일치하거나 클라이언트에 보낼 행을 제한하는데 사용됩니다. `type`이 ALL 또는 index인 경우 Extra가 Using where가 아니라면, 문제가 될 수 있습니다.

