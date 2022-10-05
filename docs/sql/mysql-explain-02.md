<style>
    .table-wrapper {
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
<div class="table-wrapper" markdown="block">

|<nobr>id</nobr>|select_type|table|<nobr>partitions</nobr>|type|possible_keys|key|key_len|ref|rows|filtered|Extra|
|--|-----------|-----|----------|----|-------------|---|-------|---|----|--------|-----|
|1|SIMPLE|NULL|NULL|NULL|NULL|NULL|NULL|NULL|NULL|NULL|No tables used|

</div>
위에 조회된 컬럼들의 간략한 설명이다.

`JSON Name` 컬럼은 `FORMAT=JSON`으로 출력했을 때의 컬럼명이다. [공식문서 링크](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-output-columns)

<div class="table-wrapper">

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
type

## possible_keys

## key

## key_len

## ref

## rows

## filtered

## Extra