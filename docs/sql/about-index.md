# Index!

## 상황
Mysql의 인덱스에 대해서 알아봅시다~!

## 

```sql
SELECT *
FROM table
WHERE index_column != 'abc' AND another_index = 'zzz';
```

to

```sql
SELECT *
FROM table
WHERE index_column != 'abc' AND sub_index > '2022-01-01' AND another_index = 'zzz';
```


