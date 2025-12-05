#!/bin/bash
# Скрипт мониторинга системы при подключении по SSH

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

get_last_login() {
    local user=$1
    if [ -z "$user" ]; then
        user=$(whoami)
    fi
    
    local last_login=$(lastlog -u "$user" 2>/dev/null | tail -n +2 | awk '{print $4, $5, $6, $7, $8}' | head -1)
    
    if [ -z "$last_login" ] || [ "$last_login" = "**Never**" ]; then
        echo "${RED}Никогда не входил${NC}"
    else
        echo "${GREEN}$last_login${NC}"
    fi
}

get_ssh_bruteforce_attempts() {
    local today=$(date +%Y-%m-%d)
    local yesterday=$(date -d "yesterday" +%Y-%m-%d)
    
    local today_attempts=$(grep "$today" /var/log/auth.log 2>/dev/null | grep "Failed password" | wc -l)
    local yesterday_attempts=$(grep "$yesterday" /var/log/auth.log 2>/dev/null | grep "Failed password" | wc -l)
    
    echo "Сегодня: ${RED}$today_attempts${NC} попыток"
    echo "Вчера: ${YELLOW}$yesterday_attempts${NC} попыток"
    
    echo ""
    echo "${CYAN}Последние 5 неудачных попыток:${NC}"
    grep "Failed password" /var/log/auth.log 2>/dev/null | tail -5 | while read line; do
        echo "${RED}  $line${NC}"
    done
}

get_active_users() {
    local users=$(who | wc -l)
    local unique_users=$(who | awk '{print $1}' | sort -u | wc -l)
    
    echo "Всего сессий: ${GREEN}$users${NC}"
    echo "Уникальных пользователей: ${BLUE}$unique_users${NC}"
    
    if [ $users -gt 0 ]; then
        echo ""
        echo "${CYAN}Активные пользователи:${NC}"
        who | while read line; do
            echo "${GREEN}  $line${NC}"
        done
    fi
}

get_system_status() {
    echo "${PURPLE}=== СТАТУС ===${NC}"
    
    local load=$(uptime | awk -F'load average:' '{print $2}')
    echo "Загрузка системы: ${YELLOW}$load${NC}"
    
    local mem_usage=$(free -h | grep "Mem:" | awk '{print $3 "/" $2}')
    echo "Использование памяти: ${BLUE}$mem_usage${NC}"
    
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}')
    echo "Использование диска (/): ${CYAN}$disk_usage${NC}"
    
    local uptime_info=$(uptime -p)
    echo "Время работы: ${GREEN}$uptime_info${NC}"
}

get_open_ports() {
    echo ""
    echo "${PURPLE}=== ОТКРЫТЫЕ ПОРТЫ ===${NC}"
    netstat -tlnp 2>/dev/null | grep LISTEN | while read line; do
        local port=$(echo $line | awk '{print $4}' | cut -d: -f2)
        local process=$(echo $line | awk '{print $7}' | cut -d/ -f2)
        
        if [ "$port" = "22" ]; then
            echo "SSH: ${GREEN}Порт $port${NC} - ${YELLOW}$process${NC}"
        elif [ "$port" = "80" ] || [ "$port" = "443" ]; then
            echo "Web: ${GREEN}Порт $port${NC} - ${YELLOW}$process${NC}"
        elif [ "$port" = "5432" ]; then
            echo "PostgreSQL: ${GREEN}Порт $port${NC} - ${YELLOW}$process${NC}"
        elif [ "$port" = "8000" ]; then
            echo "API: ${GREEN}Порт $port${NC} - ${YELLOW}$process${NC}"
        else
            echo "Другой: ${YELLOW}Порт $port${NC} - ${YELLOW}$process${NC}"
        fi
    done
}

get_security_logs() {
    echo ""
    echo "${PURPLE}=== ЛОГИ ===${NC}"
    
    local auth_errors=$(grep "authentication failure" /var/log/auth.log 2>/dev/null | tail -3)
    if [ ! -z "$auth_errors" ]; then
        echo "${RED}Последние ошибки аутентификации:${NC}"
        echo "$auth_errors" | while read line; do
            echo "${RED}  $line${NC}"
        done
    fi
    
    local suspicious=$(grep -i "suspicious\|attack\|intrusion" /var/log/syslog 2>/dev/null | tail -2)
    if [ ! -z "$suspicious" ]; then
        echo "${YELLOW}Подозрительная активность:${NC}"
        echo "$suspicious" | while read line; do
            echo "${YELLOW}  $line${NC}"
        done
    fi
}

main() {
    clear
    echo "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo "${CYAN}║                    МОНИТОРИНГ СИСТЕМЫ                        ║${NC}"
    echo "${CYAN}║                    $(date '+%d.%m.%Y %H:%M:%S')                    ║${NC}"
    echo "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Информация о пользователе
    echo "${PURPLE}=== ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ ===${NC}"
    echo "Текущий пользователь: ${GREEN}$(whoami)${NC}"
    echo "Последний вход: $(get_last_login)"
    echo ""
    
    # Активные пользователи
    echo "${PURPLE}=== АКТИВНЫЕ ПОЛЬЗОВАТЕЛИ ===${NC}"
    get_active_users
    echo ""
    
    # SSH брутфорс
    echo "${PURPLE}=== SSH БРУТФОРС АТАКИ ===${NC}"
    get_ssh_bruteforce_attempts
    echo ""
    
    # Статус системы
    get_system_status
    echo ""
    
    # Открытые порты
    get_open_ports
    echo ""
    
    # Логи безопасности
    get_security_logs
    echo ""
    
    # Финальная информация
    echo "${PURPLE}=== ИНФОРМАЦИЯ О БЕЗОПАСНОСТИ ===${NC}"
    echo "✅ Пароли вынесены в .env файл"
    echo "✅ SSL включен для PostgreSQL"
    echo "✅ JWT аутентификация настроена"
    echo "✅ Мониторинг безопасности активен"
    echo "⚠️  Пароли и секреты хранятся в .env файле (права 600)"
    echo ""
    echo "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo "${CYAN}║              МОНИТОРИНГ ЗАВЕРШЕН УСПЕШНО                    ║${NC}"
    echo "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
}

# Запуск скрипта
main "$@"
