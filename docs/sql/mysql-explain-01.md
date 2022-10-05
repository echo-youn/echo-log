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

## id
실행 계획의 SELECT 별로 부여되는 키다.

## select_type
쿼리의 타입을 표시해 주는 컬럼이다. 위 컬럼에서 표시되는 컬럼은 다음과 같다.
- **SIMPLE**
  
  UNION 이나 서브쿼리가 없는 단순 조회 쿼리이다.

```sql
DESC SELECT 1;

id|select_type|table|partitions|type|possible_keys|key|key_len|ref|rows|filtered|Extra         |
--+-----------+-----+----------+----+-------------+---+-------+---+----+--------+--------------+
 1|SIMPLE     |     |          |    |             |   |       |   |    |        |No tables used|
```

- **PRIMARY**
  
  서브쿼리와 함께 쓰일 때 가장 바깥쪽 SELECT이다. Optimizer의 동작에 따라 제일 바깥쪽이 아니거나 한개가 아닐 수 있다.

```sql
DESC 
SELECT * -- PRIMARY #1
FROM (SELECT 1) as a -- #DERIVED 2
JOIN (SELECT 1) as b; -- #DERIVED 3

id|select_type|table     |partitions|type  |possible_keys|key|key_len|ref|rows|filtered|Extra         |
--+-----------+----------+----------+------+-------------+---+-------+---+----+--------+--------------+
 1|PRIMARY    |<derived2>|          |system|             |   |       |   |   1|   100.0|              |
 1|PRIMARY    |<derived3>|          |system|             |   |       |   |   1|   100.0|              |
 3|DERIVED    |          |          |      |             |   |       |   |    |        |No tables used|
 2|DERIVED    |          |          |      |             |   |       |   |    |        |No tables used|
```

- **UNION**
  
   유니언 중 2번째와 2번째 이후의 쿼리
```sql
DESC SELECT 1 UNION SELECT 2 UNION SELECT 3;

id|select_type |table       |partitions|type|possible_keys|key|key_len|ref|rows|filtered|Extra          |
--+------------+------------+----------+----+-------------+---+-------+---+----+--------+---------------+
 1|PRIMARY     |            |          |    |             |   |       |   |    |        |No tables used |
 2|UNION       |            |          |    |             |   |       |   |    |        |No tables used |
 3|UNION       |            |          |    |             |   |       |   |    |        |No tables used |
  |UNION RESULT|<union1,2,3>|          |ALL |             |   |       |   |    |        |Using temporary|
```
- **DEPENDENT UNION**
  
   외부 쿼리의 값을 참조하고 있는 유니언 쿼리 중 2번째와 2번째 이후의 쿼리
```sql
DESC 
SELECT * -- Primary # 1
FROM (SELECT 1 as a) as b -- DERIVED # 2
WHERE a IN (
    SELECT 1    -- DEPENDENT SUBQUERY #3
    UNION 
    SELECT 1    -- DEPENDENT UNION #4
    UNION
    SELECT 2    -- DEPENDENT UNION #5
); -- UNION RESULT

id|select_type       |table       |partitions|type  |possible_keys|key|key_len|ref|rows|filtered|Extra          |
--+------------------+------------+----------+------+-------------+---+-------+---+----+--------+---------------+
 1|PRIMARY           |<derived2>  |          |system|             |   |       |   |   1|   100.0|               |
 3|DEPENDENT SUBQUERY|            |          |      |             |   |       |   |    |        |No tables used |
 4|DEPENDENT UNION   |            |          |      |             |   |       |   |    |        |No tables used |
 5|DEPENDENT UNION   |            |          |      |             |   |       |   |    |        |No tables used |
  |UNION RESULT      |<union3,4,5>|          |ALL   |             |   |       |   |    |        |Using temporary|
 2|DERIVED           |            |          |      |             |   |       |   |    |        |No tables used |
```
- **UNION RESULT**
  
  유니언 쿼리의 결과
```sql
DESC 
SELECT 1
UNION
SELECT 2
UNION
SELECT 3;

id|select_type |table       |partitions|type|possible_keys|key|key_len|ref|rows|filtered|Extra          |
--+------------+------------+----------+----+-------------+---+-------+---+----+--------+---------------+
 1|PRIMARY     |            |          |    |             |   |       |   |    |        |No tables used |
 2|UNION       |            |          |    |             |   |       |   |    |        |No tables used |
 3|UNION       |            |          |    |             |   |       |   |    |        |No tables used |
  |UNION RESULT|<union1,2,3>|          |ALL |             |   |       |   |    |        |Using temporary|
```
- **SUBQUERY**
  
  서브 쿼리들 중 첫번째 서브쿼리
```sql
DESC 
SELECT * -- Primary #1
FROM (SELECT 1 as a) as b -- Derived #2
WHERE EXISTS (SELECT 1) -- SUBQUERY #3
AND EXISTS (SELECT 2); -- SUBQUERY #4

id|select_type|table     |partitions|type  |possible_keys|key|key_len|ref|rows|filtered|Extra         |
--+-----------+----------+----------+------+-------------+---+-------+---+----+--------+--------------+
 1|PRIMARY    |<derived2>|          |system|             |   |       |   |   1|   100.0|              |
 4|SUBQUERY   |          |          |      |             |   |       |   |    |        |No tables used|
 3|SUBQUERY   |          |          |      |             |   |       |   |    |        |No tables used|
 2|DERIVED    |          |          |      |             |   |       |   |    |        |No tables used|
```
- **DEPENDENT SUBQUERY**
  
  외부 쿼리의 값을 참조하는 서브쿼리들 중 첫번째

```sql
DESC 
SELECT * -- Primary
FROM (SELECT 1 as a) as b -- Derived
WHERE a IN (SELECT 1 UNION SELECT 2); -- DEPENDENT SUBQUERY, DEPENDENT UNION

id|select_type       |table     |partitions|type  |possible_keys|key|key_len|ref|rows|filtered|Extra          |
--+------------------+----------+----------+------+-------------+---+-------+---+----+--------+---------------+
 1|PRIMARY           |<derived2>|          |system|             |   |       |   |   1|   100.0|               |
 3|DEPENDENT SUBQUERY|          |          |      |             |   |       |   |    |        |No tables used |
 4|DEPENDENT UNION   |          |          |      |             |   |       |   |    |        |No tables used |
  |UNION RESULT      |<union3,4>|          |ALL   |             |   |       |   |    |        |Using temporary|
 2|DERIVED           |          |          |      |             |   |       |   |    |        |No tables used |
```
- **DERIVED**
  
   파생 테이블
```sql
DESC 
SELECT * -- Primary #1
FROM (SELECT 1 as a) as b; -- Derived #2

id|select_type|table     |partitions|type  |possible_keys|key|key_len|ref|rows|filtered|Extra         |
--+-----------+----------+----------+------+-------------+---+-------+---+----+--------+--------------+
 1|PRIMARY    |<derived2>|          |system|             |   |       |   |   1|   100.0|              |
 2|DERIVED    |          |          |      |             |   |       |   |    |        |No tables used|
```
- **DEPENDENT DERIVED**
  
   다른 쿼리의 값을 참조하는 파생 테이블

```sql
-- mysql 5.8 부터 지원...
```
- **MATERIALIZED**
  
   구체화된 서브쿼리
- **UNCACHEABLE SUBQUERY**
  
   결과를 캐시할 수 없고 외부 쿼리의 각 행에대해 다시 평가되는 하위 쿼리
- **UNCACHEABLE UNION**
  
  캐시될 수 없는 서브쿼리 중 두번째 혹은 그 이후의 유니언


# table
쿼리가 참조하는 테이블의 이름 또는 아래의 경우

- **\<union M,N\>**
  
   유니언 되는 M, N 쿼리의 id

- **\<derived N\>**
  
   파생테이블 N의 id. 예를 들어 FROM 절의 하위 쿼리.

- **\<subquery N\>**
  
  구체화된 서브쿼리 N 의 id

# partitions

파티션 된 테이블일 경우 파티션 명
