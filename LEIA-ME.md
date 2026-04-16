# Guia de Publicação — Mapa de Trabalho Secretarias

## Arquivos do projeto

```
mapa-secretarias/
├── index.html        ← Formulário (publicar no Vercel)
├── apps-script.js    ← Colar no Google Apps Script
└── LEIA-ME.md        ← Este guia
```

---

## PASSO 1 — Criar a planilha no Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma **nova planilha em branco**
2. Dê o nome que quiser (ex: "Mapa de Trabalho — Respostas")
3. Deixe a aba com o nome padrão (não precisa renomear, o script cria "Respostas" automaticamente)

---

## PASSO 2 — Configurar o Google Apps Script

1. Dentro da planilha, vá em **Extensões → Apps Script**
2. Apague o código que aparecer (`function myFunction() {}`)
3. Cole **todo o conteúdo** do arquivo `apps-script.js`
4. Clique em **Salvar** (ícone de disquete ou Ctrl+S)
5. Clique em **Implantar → Nova implantação**
6. Em "Tipo", selecione **App da Web**
7. Preencha:
   - Descrição: `Mapa Secretarias`
   - Executar como: **Eu mesmo (seu e-mail)**
   - Quem tem acesso: **Qualquer pessoa**
8. Clique em **Implantar**
9. Autorize o acesso quando solicitado (clique em "Permitir")
10. **Copie a URL** que aparecer — ela terá o formato:
    ```
    https://script.google.com/macros/s/XXXXXXXXXXXXXXXXX/exec
    ```

---

## PASSO 3 — Conectar o formulário à planilha

1. Abra o arquivo `index.html` em um editor de texto (Notepad, VS Code, etc.)
2. Localize a linha:
   ```js
   const SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
   ```
3. Substitua `COLE_AQUI_A_URL_DO_APPS_SCRIPT` pela URL copiada no Passo 2:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/SEU_ID/exec";
   ```
4. Salve o arquivo

---

## PASSO 4 — Publicar no Vercel

### Opção A — Upload direto (mais fácil, sem precisar de Git)

1. Acesse [vercel.com](https://vercel.com) e crie uma conta gratuita
2. No painel, clique em **Add New → Project**
3. Clique em **"Deploy without a Git repository"** ou arraste a pasta `mapa-secretarias`
4. O Vercel detectará o `index.html` automaticamente
5. Clique em **Deploy**
6. Após alguns segundos, você receberá a URL pública do formulário (ex: `mapa-secretarias.vercel.app`)

### Opção B — Via GitHub (recomendado para atualizações futuras)

1. Crie um repositório no [github.com](https://github.com)
2. Faça upload dos arquivos (só o `index.html` é necessário)
3. No Vercel, conecte sua conta GitHub e selecione o repositório
4. Clique em **Deploy**
5. Cada vez que atualizar o `index.html` no GitHub, o Vercel republicará automaticamente

---

## PASSO 5 — Testar

1. Abra a URL do seu formulário no Vercel
2. Preencha todos os campos obrigatórios e clique em **Enviar**
3. Acesse sua planilha no Google Sheets — os dados devem aparecer em poucos segundos na aba **"Respostas"**

---

## Dúvidas frequentes

**Os dados não chegam na planilha**
- Verifique se a URL no `index.html` está correta (sem espaços extras)
- Confirme que a implantação no Apps Script está com acesso **"Qualquer pessoa"**
- No Apps Script, clique em **Implantar → Gerenciar implantações** e verifique se está ativa

**Preciso adicionar mais itens na tabela**
- Adicione a linha no `index.html` seguindo o mesmo padrão das outras linhas
- Adicione os cabeçalhos e dados correspondentes no `apps-script.js`
- Reimplante o Apps Script (Implantar → Gerenciar implantações → Editar → Nova versão)

**Posso usar um domínio próprio?**
- Sim! No painel do Vercel, vá em Settings → Domains e adicione seu domínio

---

## Suporte

Qualquer dúvida, abra uma conversa com o Claude e cole a mensagem de erro que aparecer.
