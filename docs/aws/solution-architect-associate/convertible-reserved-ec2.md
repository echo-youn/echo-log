# Convertible Reserved EC2

## Reserved Instance (RI)

Reserved Instances (RIs)는 On-Demand 인스턴스 가격 에 비해 최대 75프로 할인된 가격으로 인스턴스를 사용할 수 있습니다. Convertible RI를 사용할 때 RI 가격의 혜택을 받으면서 제품군, OS 유형 그리고 테넌시를 유연하게 조절할 수 있습니다. 여기서 중요한 점은 RI는 물리적 인스턴스가 아니라 On-Demand 인스턴스 사용량에 대한 비용 할인이라는 점입니다.

RI는 `Standard`와 `Convertible`로 나뉩니다. `Standard RI`는 `Convertible RI`보다 확실히 더 많은 할인을 제공합니다. 그러나 `Standard RI`는 `Convertible RI`보다는 유연한 운영이 어렵습니다. `Convertible RI`는 인스턴스 타입이나 테넌시를 교체할 수 있습니다.

Standard RI는 AZ, scope, network platform, Instance Size 등을 동일한 인스턴스 유형내에서 수정할 수 있습니다. Convertible RI는 마켓플레이스에서 판매할 수 없습니다.

## Question

Standard RI와 Convertible RI를 동시에 사용했을때 얻을 수 있는 이점은 무엇인가?





## 지문 분석

- **Unused Convertible Reserved Instances can later be sold at the Reserved Instance Marketplace.**

  이 지문은 맞지 않다. Convnertible RI는 마켓플레이스에 판매할 수 없다.

- **It can enable you to reserve capacity for your Amazon EC2 instances in multiple Availability Zones and multiple AWS Regions for any duration.**

  Reserve 용량은 AWS Region 또는 AZ별로 구분되어 있다. 단일 RI 구매로 여러개의 Region에 할당할 수 없다.

- **It runs in a VPC on hardware that's dedicated to a single customer.**

  이 내용은 RI에 관한 내용이 아닌, Dedicated Instance(전용 인스턴스)에 대한 설명입니다. 전용 인스턴스는 단일 고객 전용 하드웨어의 VPC에서 실행됩니다.

