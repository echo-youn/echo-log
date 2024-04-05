# Inventory

`Ansible`은 패키지 설치된 `컨트롤 노드`와 `매니지드 노드`가 있다.

이때 매니지드 노드의 갯수가 여러개일수 있는데 이 노드들을 논리적인 집합으로 묶어두고 별칭을 붙여 사용할 수 있도록 도와주는 것이 바로 `Inventory`다.

## INI 파일

먼저 `ini` 확장자로 인벤토리를 만드는 법을 알아보자.

그룹명은 `webservers`와 `dbservers`로 설정한다. 

1. 파일 시스템 아무곳에 `inventory.ini`를 만든다.
2. 그리고 아래와 같이 작성할 수 있다.
```
mail.example.com

[webservers]
foo.example.com
bar.example.com

[dbservers]
one.example.com
two.example.com
three.example.com
```

## YAML 파일

위와 같은 인벤토리를 이번엔 YAML 로 만들어본다.

```yaml
ungrouped:
  hosts:
    mail.example.com:
webservers:
  hosts:
    foo.example.com:
    bar.example.com:
dbservers:
  hosts:
    db_01:
      ansible_host: one.example.com # Advanced 설정이 필요한 경우 사용할 수 있다.
    two.example.com:
    three.example.com:

```

## 여러 그룹 만들기

앤서블을 사용하다보면 노드들을 여러 기준으로 나누어야하는데 이럴때 그룹을 여러개 두고 사용할 수 있다.

앤서블에서는 `parent/child` 구조라고 일컷는데 INI 파일에서는 `:children` suffix를 사용하고 YAML 에서는 `children:` entry를 사용한다.

::: code-group

```text [inventory.ini]
mail.example.com

[webservers]
foo.example.com
bar.example.com

[dbservers]
one.example.com
two.example.com
three.example.com

[east]
foo.example.com
one.example.com
two.example.com

[west]
bar.example.com
three.example.com

[prod:children]
east

[test:children]
west
```

```yaml [inventory.yaml]
ungrouped:
  hosts:
    mail.example.com:
webservers:
  hosts:
    foo.example.com:
    bar.example.com:
dbservers:
  hosts:
    one.example.com:
    two.example.com:
    three.example.com:
east:
  hosts:
    foo.example.com:
    one.example.com:
    two.example.com:
west:
  hosts:
    bar.example.com:
    three.example.com:
prod:
  children:
    east:
test:
  children:
    west:
```

:::

## 사용 예재

환경별로 인벤토리를 만드는 경우

::: code-group

```yaml [inventory_test.yaml]
dbservers:
  hosts:
    db01.test.example.com
    db02.test.example.com
appservers:
  hosts:
    app01.test.example.com
    app02.test.example.com
    app03.test.example.com
```

```yaml [inventory_prod.yaml]
dbservers:
  hosts:
    db01.prod.example.com
    db02.prod.example.com
appservers:
  hosts:
    app01.prod.example.com
    app02.prod.example.com
    app03.prod.example.com
```

:::

## References
- https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html
