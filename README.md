# projeto18-valex
Projeto 18 - Valex: API em Typescript responsável pela criação, recarga, ativação e compras via cartões de benefícios

## Usage
BASH:
```
$ git clone https://github.com/samuelmarco-dev/projeto18-valex.git

$ cd projeto18-valex

$ npm install or npm i

$ npm run dev
```

API:

```
cardRouter:
    POST: /card/create
        - Rota para criação de cartão de benefício
        - headers: {
            "x-api-key": "api-key"
        }
        - body: {
            "employeeId": w,
            "typeCard": ["groceries", "restaurant", "transport",
            "education", "health"]
        }

    POST: /card/active/:id
        - Rota para ativação de cartão de benefício
        - body: {
            "cardId": w,
            "cvv": "xxx",
            "password": "xxx",
            "confirmPassword": "xxx"
        }

    GET: /cards/:employeeId
        - Rota para buscar cartões de benefício de um funcionário
        - body: {
            "employeeId": w,
            "passwords": [
                {
                    "cardId": w,
                    "password": "xxxx",
                    "cvv": "xxx",
                    "type": ["groceries", "restaurant", "transport",
                    "education", "health"]
                }
                // min: 1, max: 5
            ]
        }

    GET: /card/balance/:id
        - Rota para buscar saldo, transações e recargas de um cartão de benefício

    PUT: /card/lock/:id
        - Rota para bloquear cartão de benefício
        - body: {
            "cardId": w,
            "password": "xxxx"
        }

    PUT: card/unlock/:id
        - Rota para desbloquear cartão de benefício
        - body: {
            "cardId": w,
            "password": "xxxx"
        }

paymentRouter:
    POST: /payment/:id
        - Rota para realizar um pagamento com cartão de benefício

rechargeRouter:
    POST: /recharge/:id
        - Rota para realizar uma recarga de cartão de benefício
```
