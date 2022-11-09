# Collation

Collation이란, 문자셋을 어떻게 정렬할지 결정하는 알고리즘이다.

LIKE, ORDER BY, INDEX, JOIN 등의 성능을 위해 알아놓자.

- Case Insensitive(CI): 대소문자를 구분하지 않는다.
  - 반대 Case Sensitive(CS)
- Accent Insensitive(AI): 악센트가 붙은 문자를 구분하지 않는다.
  - 반대 Accent Sensitive(AS)
- Kana Insensitive(KI): 일본어의 가카타나와 히라가나를 구분하지 않는다.
  - 반대 Kana Sensitive(KS)
- Width Insensitive(WI): 1바이트 문자와 2바이트 문자를 구분하지 않는다.
  
  ```
    E=mc² == E=mc2
  ```
  - 반대 Width Sensitive(WS)
- Binary(Bin): 바이너리 저장값 순서 그대로 정렬한다. 
  ```
    A(41) -> B(42) -> a(61) -> b(62)
  ```
- General: 라틴계열 문자를 사람의 인식에 맞게 정렬 (A -> a -> B -> b)
- unicode: general 보다 더 사람에 맞게 정렬(다른 언어들은 genaral과 같음) 특수문자 정렬의 순서가 변경 
