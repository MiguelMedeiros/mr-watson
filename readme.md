# Mr. Watson - Seu ajudante pessoal para trades de Bitcoin
Site oficial: https://www.mrwatson.com.br
Autor: Miguel Medeiros - http://www.miguelmedeiros.com.br



## Instalação

### Passo 1: Instalar Node JS
O único requisito para o Mr. Watson é o NodeJS, você precisa ter ele instalado na sua máquina.
A instalação muda de acordo com seu sistema operacional, mas basta seguir os passos do site do próprio NodeJS.
Faça o download do site oficial do NodeJS:
[link para o site oficial do Node JS!](https://nodejs.org/en/)

### Passo 2: Download do Mr. Watson
Você pode clonar o repositório do GitHub:
```
git clone https://github.com/MiguelMedeiros/mr-watson.git .
```

### Passo 3: Instalar dependências
Você deve abrir o terminal na pasta onde extraiu os arquivos do passo 1.
E rodar o seguinte comando:
```
npm install
```

### Passo 4: Iniciar o back-end
Você deve abrir o terminal na pasta onde extraiu os arquivos do passo 1.
E rodar o seguinte comando:
```
npm start
```

### Passo 5: Iniciar o front-end
Você deve abrir o navegador de sua preferência e entrar no endereço:
```
http://localhost:5000
```



## Configuração

### Passo 1: Criar chaves na Exchange
- Faça o Login na sua conta da sua Exchange e vá até o link "API" no rodapé do site;
- Em seguida clique no botão "+ Nova API Key";
- Selecione todos as opções menos as de depósito e saque;
- Clique no botão "Create";
- Guarde as informações de "key", "password" e "secret" para o passo 3.

### Passo 2: Criar chaves do Telegram
Para gerar as chaves privadas e saber o chatID do seu bot, siga os passos do site oficial do Telegram:
[Link com informações oficiais para criar seu bot no Telegram.](https://core.telegram.org/bots#3-how-do-i-create-a-bot)

Mas para te dar uma noção é basicamente adicionar o @botfather no seu telegram.
Conversando com ele você terá acesso as informações de "token" e "chatid".
Guarde essas informações para o próximo passo!

### Passo 3: Configurar arquivo config.json
O arquivo de configuração que você precisará editar fica na pasta raíz do Mr. Watson.
Basta você abrir o arquivo:
```
config.json
```
Complete todos os campos com as informações dos passos anteriores.



## APIs integradas
- [BlinkTrade](https://blinktrade.com/docs/)
- [Blockchain.info](https://blockchain.info/pt/api)
- [Telegram](https://github.com/yagop/node-telegram-bot-api)



## Exchanges integradas
- [Foxbit - Brasil](https://foxbit.com.br/)
- [Bitcambio - Brasil](https://bitcambio.com.br/)
- [ChileBit - Chile](https://chilebit.net/)
- [SurBitcoin - Venezuela](https://surbitcoin.com/)
- [VBTC - Vietnã](https://vbtc.exchange/)


