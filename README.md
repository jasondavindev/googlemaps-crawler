# Google Maps Crawler

Crawler para obter a paginação de resultados do Google Maps.

## Executando

- Abra o site do Google Maps e procure por "Escola de futebol Sao Paulo"
- Copie e cole o código do arquivo **main.js** no console do navegador.
- Execute `crawler.start()`
- Quando a paginação estiver finalizada, execute `crawler.text` para obter todos os resultados em formato texto

**Observação**: você deve manter aberta a aba em que o código está executando, pois a renderização dos elementos HTML impacta o funcionamento do script.

### Configuração
- Você pode definir a string de match na variável ```matchText```
- A variável ```TIME_SLEEP_ALL``` controla o tempo de espera caso algum elemento não foi encontrado/renderizado