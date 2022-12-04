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

### Basic 

```kotlin
for (i in 1..100) {
    print(i)
}
```

### Advanced

```kotlin
for (i in 0 upTo 1 step 2) { // 오름
    print(i)
}

for (i in 100 downTo 1 step 2) {
    print(i)
}
```
