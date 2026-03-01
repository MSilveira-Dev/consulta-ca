import requests
from bs4 import BeautifulSoup

def pegar_valor(soup, label):
    th = soup.find("th", string=label)
    if th:
        td = th.find_next("td")
        if td:
            return td.get_text(strip=True)
    return None

def converter_data(data_extenso):
    if not data_extenso:
        return None

    meses = {
        "janeiro": "01",
        "fevereiro": "02",
        "março": "03",
        "abril": "04",
        "maio": "05",
        "junho": "06",
        "julho": "07",
        "agosto": "08",
        "setembro": "09",
        "outubro": "10",
        "novembro": "11",
        "dezembro": "12",
    }

    try:
        partes = data_extenso.lower().split(" de ")
        dia = partes[0].zfill(2)
        mes = meses.get(partes[1])
        ano = partes[2]
        return f"{dia}/{mes}/{ano}"
    except:
        return None

def limpar_situacao(texto):
    if not texto:
        return None

    texto = texto.upper()

    if "VÁLIDO" in texto:
        return "VÁLIDO"
    if "VENCIDO" in texto:
        return "VENCIDO"

    return None

def consultar_ca(ca):
    url = f"https://meuca.com.br/busca/?t=ca&s={ca}"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.exceptions.RequestException:
        return {
            "status_code": None,
            "ca": ca,
            "erro": "Servidor indisponível, tente novamente mais tarde"
        }

    status_code = response.status_code

    if status_code != 200:
        return {
            "status_code": status_code,
            "ca": ca,
            "erro": "Servidor indisponível, tente novamente mais tarde"
        }

    soup = BeautifulSoup(response.text, "html.parser")

    razao_social = pegar_valor(soup, "Razão Social")
    validade_extenso = pegar_valor(soup, "Data de Validade")
    situacao_bruta = pegar_valor(soup, "Situação")
    tipo = pegar_valor(soup, "Equipamento")

    validade = converter_data(validade_extenso)
    situacao = limpar_situacao(situacao_bruta)

    # CA inexistente
    if not any([razao_social, validade, situacao, tipo]):
        return {
            "status_code": status_code,
            "ca": ca,
            "erro": "CA inexistente ou inserido incorretamente"
        }

    return {
        "status_code": status_code,
        "ca": ca,
        "razao_social": razao_social,
        "validade": validade,
        "situacao": situacao,
        "tipo_equipamento": tipo
    }