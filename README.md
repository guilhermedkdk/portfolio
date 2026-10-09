<h1 align="center"><a href="https://guilhermeperes.dev">Portfólio</a></h1>

<p align= "center">O Portfólio é o meu site pessoal, onde reúno projetos, experiência profissional e currículo, desenvolvido com Next.js e foco em performance, acessibilidade e animações em canvas</p>

<p align="center">
<a href="https://guilhermeperes.dev">🔗 Live App</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#-projeto">💻 Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#-tecnologias">🚀 Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#-estrutura">📁 Estrutura</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#-instalação">📦 Instalação</a>
</p>

## 💻 Projeto

Portfólio é o site onde apresento meu trabalho como desenvolvedor fullstack. Nele estão meus projetos, minha experiência profissional, minha formação e o currículo em PDF para download.

A página é gerada de forma estática no build, em português e em inglês. O topo tem uma grade interativa e o rodapé um céu estrelado, os dois desenhados em canvas. As animações pausam fora da tela e respeitam a preferência de movimento reduzido do sistema.

O site é responsivo e acessível, com link para pular ao conteúdo, foco visível e abas navegáveis pelo teclado. Também conta com otimizações de SEO, como sitemap e uma imagem de compartilhamento gerada com as mesmas fontes do site.

Sinta-se à vontade para conhecer meu trabalho e entrar em contato!

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- Next.js 16 (App Router) e React 19
- TypeScript
- Tailwind CSS 4
- next-intl
- Framer Motion
- LaTeX para o currículo

## 📁 Estrutura

```
src/
  app/[locale]/     página, layout e imagem de compartilhamento de cada idioma
  components/       seções da página e seus cards
  components/ui/    peças reutilizáveis: botões, títulos e efeitos em canvas
  lib/              dados do site (projetos, experiências, links) e utilitários
  i18n/             configuração dos idiomas
messages/           textos em português e inglês
cv/                 currículo em LaTeX, um arquivo por idioma
public/cv/          PDFs do currículo que o site oferece para download
```

## 📦 Instalação

Siga os passos abaixo para rodar o Portfólio localmente em ambiente de desenvolvimento:

```bash
# Clone o repositório para o diretório desejado
git clone git@github.com:guilhermedkdk/portfolio.git

# Acesse a pasta do projeto
cd portfolio

# Instale as dependências do projeto
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O site abre em `http://localhost:3000` e redireciona para o idioma do navegador.
