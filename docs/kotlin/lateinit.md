# Late initialize

코틀린에서는 일반적으로 클래스를 생성할때 생성자에서 모든 프로퍼티를 초기화해야 한다. 그런데 클래스가 생성될 당시에 할당될 수 없는 프로퍼티가 있을 수 있다.

이럴때 그 프로퍼티를 nullable로 정의한다면 그 프로퍼티를 참조할때마다 null 핸들링을 해줘야해서 가독성이 낮아 질 수 있다.

이때를 위해 `lateinit` 변경자가 만들어 졌다. 이 변경자를 붙이면 프로퍼티를 나중에 초기화할 수 있다.

`lateinit`으로 정의된 프로퍼티는 무조건 `var` 타입이여야 한다. `val`은 무조건 final로 컴파일되고 무조건 생성자안에서 초기화되어야한다. 생성자 밖에서 초기화 되어야하는 프로퍼티는 항상 `var`여야 한다.

이후에 이 프로퍼티를 참조할때에 아직 초기화가 되지 않았다면 `lateinit property ... has not been initialized` 예외가 발생한다.
이는 NPE가 발생하는것 보다 찾기 쉬워 NPE를 발생시키는것 보다는 낫다.