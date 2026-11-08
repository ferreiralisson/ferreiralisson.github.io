# Alisson Ferreira • Portfólio

Portfólio estático em português: engenharia de software, projetos abertos e ensino.

Endereço de publicação: https://ferreiralisson.github.io/

## Desenvolvimento

HTML, CSS e JavaScript, sem build ou dependências externas para renderizar a página.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra http://127.0.0.1:8000. Encerre com Ctrl+C.

## Editar

- `index.html`: textos, projetos, links e metadados.
- `assets/style.css`: identidade visual e responsividade.
- `assets/site.js`: filtros, destaque das tecnologias e recálculo do layout.
- `assets/favicon.svg`: ícone da aba.
- `assets/scrollcraft.js` e `assets/scrollcraft.css`: motor original, sem alterações.

Os projetos usam `data-tech` para filtragem e as tags usam `data-stack` para destacar a tecnologia selecionada. Cada projeto inclui problema, decisão técnica e trade-off. O conteúdo e os links funcionam sem JavaScript.

## Publicação

GitHub Pages a partir da branch `main`, pasta `/ (root)`. Novos commits nessa branch atualizam o site. `.nojekyll` identifica o conteúdo como estático.

## Verificações

```sh
node checks/filter.test.cjs
python3 checks/structure.py
node --check assets/site.js
```

Os testes de filtros usam DOM simulado e não substituem inspeção visual no navegador.

## Licença de terceiros

Consulte `THIRD_PARTY_NOTICES.md` para a licença do motor Scroll Craft.
