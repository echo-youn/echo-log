# Loop Iterating

코틀린에서 반복문을 반복하는 방식에 대해 설명해보려고 한다.

- while (do-while)
- for

## While & Do while loop

while 문과 do while문은 타 언어들과 별반 다르지 않다.

```kotlin
while(True) {
    // forever...
}

do {
    // Run once
} while (False)
```

## For loop

```kotlin
// 오름차순
for (i in 1..100) {
    println(i)
}

// 오름차순 건너뛰기
for (i in 0..100 step 2) {
    println(i)
}
// result
0
2
4
6

// 내림차순 건너뛰기
for (i in 100 downTo 1 step 2) {
    println(i)
}
// result
100
98
96
94
92

// 교집합
for (i in 0..100 intersect (1..8).step(2)) {
    println(i)
}
// result
1
3
5
7

// Exclude
for (i in 0..100 subtract  (1..8).step(2)) {
    println(i)
}
// result
2
4
6
8
9
10

// Union
for (i in 1..5 union 10..15) {
    println(i)
}
// result
1
2
3
4
5
10
11
```

## 컬렉션 또는 범위 원소 검사

```kotlin
// 컬렉션 이터레이션
val map = mapOf('a' to "A", 'b' to "B")

for((key, value) in map) {
    println("$key: $value")
}
// result
a: A
b: B

// 인덱스가 포함된 리스트 이터레이션
val list = listOf("a", "b", "c")

for((index, value) in list.withIndex()) {
    println("$index: $value")
}
// result
0: a
1: b
2: c

// 범위 원소 검사
println('C' in 'A'..'Z')
// result
true

println('C' !in 'A'..'Z')
// result
false

```
