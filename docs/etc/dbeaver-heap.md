# DBeaver heap space 부족

DBeaver를 이용하여 Bulk 데이터를 이동 또는 저장하는 경우 데이터가 많은경우 힙 메모리가 부족하여 진행이 안된다는 오류로 더 이상 진행되지 않는 경우가 있다.

이런 경우 대처할 수 있는 몇가지 방법입니다.

### Disable batches

Data Trasfer의 진행 단계 중 Data load Setting의 Performance란에 `Disable batches`를 활성화합니다.

그러면 데이터 한개에 INSERT와 COMMIT이 한번에 한개씩 이루어집니다.

대신 이 방법은 속도가 매우 느려지므로 별로 추천하지 않는 방법입니다.

### multi-row insert 사이즈 조절

Disable batches와 같은 곳에 `Use muilti-row value insert`의 값과 `Do commit after row insert`의 값을 적절히 설정합니다.

`Use muilti-row value insert`는 한번에 여러개의 데이터를 전송하는것이고 `Do commit after row insert`는 커밋을 하는 주기입니다.

이 수를 적절히 조절한다면 데이터의 양에 따라 오래 걸릴 수 있지만 메모리 부족 현상이 해결됩니다.

### DBeaver Heapsize 설정 변경

맥 OS 기준으로 `/Applications/DBeaver.app/Contents/Eclipse` 또는 `/Applications/DBeaverEE.app/Contents/Eclipse` 에 있는 `dbeaver.ini` 파일을 수정해 DBeaver의 jvm 힙 사이즈를 변경 할 수 있습니다.

저는 brew로 DBeaver를 CE 에디션으로 설치하여 전자로 설치 되어있습니다.

```shell
$ cd /Applications/DBeaver.app/Contents/Eclipse
$ vi dbeaver.ini
```

그리고 다음을 수정합니다. 

`-Xms128m` -> `-Xms256m`

`-Xmx1024m` -> `-Xmx4096`

이는 JVM option 중 어플리케이션의 최소 힙사이즈와 최대 힙사이즈를 의미합니다.

환경과 필요에 따라 적당한 값으로 설정하시면 됩니다.
만약 `-Xms`와 `-Xmx`의 값을 같도록 설정한다면 어플리케이션 실행 후 종료시 까지 해당 힙 메모리를 할당하여 반환하지 않고 프로그램을 사용하게 됩니다.
