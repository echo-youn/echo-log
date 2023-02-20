# Redis 자소

Redis는 문자열, 리스트, 해시, 집합 등 다양한 데이터 타입을 지원하며, 각 데이터 타입에 대한 다양한 연산을 제공합니다. 한글 자소 단위로 데이터를 검색하고 그 검색된 데이터의 키 값을 조회하는 기능을 구현하려면 Redis의 문자열 데이터 타입과 문자열 연산 중 일부를 사용해야 합니다.

가장 간단한 방법은 Redis의 SET 명령어를 사용하여 한글 단어를 저장하는 것입니다. 그러면 한글 단어의 모든 자소 조합이 SET의 멤버로 저장됩니다. 예를 들어 "안녕"을 저장하면 "ㅇㅏㄴ", "ㅏㄴㄴ", "ㄴㅕㅇ" 등 모든 자소 조합이 SET의 멤버로 저장됩니다. 그리고 나서 Redis의 SMEMBERS 명령어를 사용하여 검색어의 모든 자소 조합이 SET의 멤버로 있는 SET을 조회하면 검색된 데이터의 키 값을 찾을 수 있습니다.

아래는 Python으로 Redis를 사용하여 한글 자소 단위로 데이터를 검색하고 그 검색된 데이터의 키 값을 조회하는 예제 코드입니다.

python
Copy code
import redis
import jamotools

r = redis.Redis(host='localhost', port=6379, db=0)

def add_word(word):
    jamo_list = jamotools.split_syllables(word)
    for jamo in jamo_list:
        r.sadd(jamo, word)

def search(query):
    jamo_list = jamotools.split_syllables(query)
    results = None
    for jamo in jamo_list:
        if results is None:
            results = r.smembers(jamo)
        else:
            results = results & r.smembers(jamo)
    return results

add_word('안녕')
add_word('안녕하세요')
add_word('반갑습니다')

print(search('안녕'))  # 결과: {b'안녕', b'안녕하세요'}
print(search('반갑'))  # 결과: {b'반갑습니다'}
위 코드에서 jamotools 모듈은 한글 단어를 자소 단위로 분리하는 데 사용됩니다. add_word 함수는 한글 단어를 받아서 자소 단위로 분리한 후, 각 자소를 Redis의 SET의 멤버로 추가합니다. search 함수는 검색어를 받아서 자소 단위로 분리한 후, 검색어의 모든 자소가 Redis의 SET의 멤버로 있는 SET을 찾아서 결과를 반환합니다.

