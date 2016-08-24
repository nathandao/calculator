# Description

A simple web service to implement a calculator. The service offers an endpoint that reads a string input and parses it. It should return either an HTTP error code, or a solution to the calculation in JSON form.

An example calculus query:
- Original query: 2 * (23/(3*3))- 23 * (2*3)
- With encoding: MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk=


# API Description

## Endpoint:
- GET /calculus?query=[input]
- The input can be expected to be UTF-8 with BASE64 encoding

###  Return:

On success: JSON response of format:

```
{ error: false, result: number }
```

On error: Either a HTTP error code or:

```
{ error: true, message: string }
```
                          
- Supported operations: + - * / ( )

# Develop


```
npm install
npm start
```

# Testing

```
npm test
```

