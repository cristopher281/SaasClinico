# Convencion interna de modulos

Cada modulo del backend debe usar esta estructura base cuando aplique:

- `controllers/`: endpoints HTTP y adaptadores de entrada.
- `services/`: casos de uso y coordinacion de reglas de negocio.
- `repositories/`: punto reservado para encapsular consultas complejas o repositorios dedicados.
- `entities/`: entidades TypeORM.
- `dto/`: contratos de entrada y salida.
- `guards/`, `strategies/`, `printing/`: infraestructura especifica del modulo.

En esta iteracion se movieron controladores y servicios a carpetas dedicadas sin alterar la logica actual. Las consultas TypeORM siguen inyectadas en `services/` para evitar regresiones mientras se estabiliza la base del sistema.
