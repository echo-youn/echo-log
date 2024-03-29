# API 디자인

코딩 중 여러 클래스에서 참조하고 있는 메서드의 파라미터를 늘리는 작업을 진행했다. 그 파라미터는 Optional로 참조하는쪽에서 그 파라미터가 없이도 잘 동작하도록 개발했다.
그런데 눈에 밟히는게 하나 있었는데, 내가 작업했던 메서드와 거의 비슷한 일을 하는, 목적도 비슷한 코드가 있었다. 그러면서 그 코드, 그 함수와 관련된 로직도 비슷하게 수정한뒤 PR을 올렸다.
그 직후 팀 리더로부터 PR에 커멘트가 달렸다.

> API가 확장 가능하다고 해서 다 넣는건 좋지 않다.
> 코드 복잡도도 늘어나고, 불필요한 선택지가 늘어나면서 클라이언트에게 혼란이 생기고, 변경하기도 점점 무거워진다.(유지보수 비용이 발생한다.)

한마디로 그때 필요한것만 심플하게 작성하는게 좋다는 의미다.

팀 리더가 준 리뷰에 거의 90프로 동의한다. 그러나 마음 한켠에는 "이왕 하는김에 다른것도 같이 해놓으면 좋지 않나?" 라는 생각이 떨쳐지지 않았다.

요즘 chatGPT에 맛들려서 이것저것 물어보는데 재미삼아 다음과 같이 질의했다.

::: details 사용자가 어떤 API를 사용할지 모를때 API 기능을 많이 넣는게 좋을까 아니면 사용자에게 딱 맞게 넣는게 좋을까?
API를 디자인할 때는 사용자의 요구사항에 맞춰 기능을 정의하는 것이 중요합니다. 모든 기능을 API에 넣는 것보다는 사용자가 실제로 필요로 하는 기능만 제공하는 것이 더욱 효율적입니다. 이는 다음과 같은 이유로 설명할 수 있습니다.

1. API의 복잡도 증가

    API에 불필요한 기능을 추가하면 API의 복잡도가 증가합니다. 복잡한 API는 이해하고 사용하기 어려워지며, 실수가 발생할 가능성도 높아집니다.

2. API의 유지보수 비용 증가

    API에 불필요한 기능을 추가하면 유지보수 비용이 증가합니다. 추가된 기능을 업데이트하거나 버그를 수정할 때마다 모든 기능을 고려해야 하기 때문입니다.

3. 사용자 경험 저하
    
    API의 기능이 너무 많으면 사용자는 필요한 기능을 찾기 어려워집니다. 이는 사용자 경험을 저하시키고, API를 사용하지 않는 다른 대안을 찾는 원인이 될 수 있습니다.

따라서, API를 디자인할 때는 사용자가 실제로 필요로 하는 기능만 제공하는 것이 좋습니다. 이는 사용자가 API를 쉽게 이해하고 사용할 수 있도록 하며, API의 복잡도와 유지보수 비용을 낮출 수 있습니다. 그러나, 사용자가 미래에 필요로 할 수 있는 기능을 예상하여 API에 추가하는 것은 권장됩니다. 이를 위해, API의 설계와 확장성을 고려하는 것이 중요합니다.
:::

팀리더의 리뷰와 거의 같은 응답이 돌아왔다.
이제는 99.9% 설득된 상태로 앞으로는 API를 디자인할때 심플하게 요구한바대로만 개발하도록 노력할 생각이다.

팀리더님 커멘트를 못믿은건 아닙니다-! :bow: :bow: :heart:

