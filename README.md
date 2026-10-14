# Portfólio do Tiago

🔗 **Site no ar:** [tiagorodriguesskt.github.io](https://tiagorodriguesskt.github.io)

Site pessoal no estilo **Terminal + Circuito Quântico**, feito só com HTML, CSS e JavaScript (sem frameworks).

📄 **Documentação técnica completa:** [docs/DOCUMENTACAO.md](docs/DOCUMENTACAO.md), com processo de construção, arquitetura, fluxogramas, a física por trás dos efeitos e guia de manutenção.

![Tela inicial](docs/img/inicio.png)

## Como abrir

- **Jeito rápido:** dê dois cliques no `index.html`.
- **Jeito recomendado (VS Code):** instale a extensão **Live Server**, clique com o botão direito no `index.html` e escolha *Open with Live Server*. A página recarrega sozinha toda vez que você salvar um arquivo.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | A estrutura e todos os textos do site |
| `style.css` | Cores, fontes e layout. As cores principais ficam no topo, em `:root` |
| `script.js` | Todos os efeitos, separados em 8 blocos comentados |
| `artigos.js` | A lista de artigos. Para publicar um artigo, é só preencher este arquivo |

## Efeitos

1. **Fundo que reage ao mouse:** a grade de pontos ondula como um pacote de onda; cada clique solta uma onda circular.
2. **Nome em superposição:** as letras trocam entre símbolos e colapsam em "Tiago". Passe o mouse no nome para repetir.
3. **Esfera de Bloch interativa:** aplique as portas H, X, Y, Z, S e T, meça o qubit e arraste para girar. Mostra θ, φ, α, β e as probabilidades.
4. **Circuito de Bell que roda:** escolha o número de shots, ligue o ruído e veja o histograma.
5. **Terminal escondido:** na seção Terminal, digite `help`.
6. **Menu que acende** a porta da seção visível e seções que aparecem ao rolar.

Quem configurou o sistema para reduzir animações vê o site sem os movimentos.

## Conteúdo

Todas as seções já estão preenchidas: início, projetos, mainframe (trabalho, curso e certificações),
formação e estudos, artigos e contato. Para mudar qualquer texto, edite o `index.html`.

A seção **Artigos** mostra "primeiro artigo em breve" enquanto a lista do `artigos.js` estiver vazia.
Os artigos não ficam no site: cada cartão leva ao Zenodo, arXiv ou Google Acadêmico.

O tempo de casa na CSU Digital é calculado sozinho pelo `script.js` a partir de `data-desde="2020-08"`.

## Como colocar no ar (GitHub Pages, grátis)

O repositório `Tiagorodriguesskt.github.io` já existe no seu GitHub, com o portfólio antigo.
Para publicar este site no lugar dele:

1. Substitua os arquivos do repositório por estes (`index.html`, `style.css`, `script.js`, `README.md`).
2. Em *Settings → Pages*, confira se a branch publicada é a `master` (ou `main`).
3. Em alguns minutos o site estará em `https://tiagorodriguesskt.github.io`.
