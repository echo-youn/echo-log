# Ansible Playbook & Modules

## Playbook
 
playbook은 원격 시스템에 설정, 배포을 위해 실행할 단계들의 집합이라 설명할 수 있습니다.

playbook은 한개 혹은 여러개의 play 로 이루어져 있습니다.

한개의 play 만으로는 단순히 ansible module을 호출하는것에 불과하지 않습니다.

다만 여러개의 play 들을 실행한다면 비로소 다중 머신 배포 도구로서 거듭날 수 있습니다.     

playbook은 사람이 읽기 쉽도록 yaml 파일로 작성되어집니다.

## Module

Ansible의 Module은 명령줄이나 플레이북 작업에서 사용할 수 있는 개별 코드 단위입니다.

모듈은 task plugin이나 library plugins라 불리기도 합니다.

커맨드 라인으로 몇가지 모듈을 실행해 봅시다.

```shell
ansible webservers -m service -a "name=httpd state=started"
ansible webservers -m ping
ansible webservers -m command -a "/sbin/reboot -t now"
```

`service` 모듈은 시스템에 백그라운드에서 실행될 프로세스를 실행, 중단할때 사용하는 모듈입니다.

`ping` 모듈은 호스트에 `ping`을 호출해 응답이 오는지 확인해볼수 있습니다.

`command/shell` 모듈은 명령을 실행하여주는 모듈입니다.

위 모듈을 playbook에서 실행한다면 다음과 같습니다.

```yaml
- name: reboot the servers
  action: command /sbin/reboot -t now

- name: reboot the servers
  command: /sbin/reboot -t now

- name: restart webserver
  service:
    name: httpd
    state: restarted
```

# References
- https://docs.ansible.com/ansible/2.7/user_guide/playbooks.html
- https://docs.ansible.com/ansible/2.7/user_guide/modules.html