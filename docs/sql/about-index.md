# Index!

## 상황

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


