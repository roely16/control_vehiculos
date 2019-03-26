/* Creacion de Tablas */

/* Tabla de ficha del vehiculo */
CREATE TABLE ADM_FICHA_VEHICULOS(

    FICHAVEHICULOID INTEGER NOT NULL,
    PLACA VARCHAR2(100) NOT NULL,
    TIPO VARCHAR2(100),
    MARCA VARCHAR2(100),
    MODELO VARCHAR2(100),
    LINEA VARCHAR2(100),
    COLOR VARCHAR2(100),
    TIPO_COMBUSTIBLE VARCHAR2(100),
    NO_MOTOR VARCHAR2(100),
    NO_CHASIS VARCHAR2(100),
    TARJETA_CIRC VARCHAR2(100),
    KM_ACTUAL INTEGER,
    KM_SERVICIO INTEGER,
    ACTIVIDAD VARCHAR2(256),
    INVENTARIOID INTEGER,
    
    CONSTRAINT ADM_FICHA_VEHICULOS_PK PRIMARY KEY (FICHAVEHICULOID),
    
    CONSTRAINT EQP_INVENTARIO_FK
        FOREIGN KEY (INVENTARIOID)
        REFERENCES EQP_INVENTARIO(INVENTARIOID)

);

/* Secuencia para la tabla de ficha de vehiculos */
CREATE SEQUENCE ADM_FICHA_VEHICULOS_SEQ START WITH 1;

/* Trigger para insertar un nuevo ID en ficha de vehiculos */
CREATE OR REPLACE TRIGGER ADM_FICHA_VEHICULOS_BIR
BEFORE INSERT ON ADM_FICHA_VEHICULOS
FOR EACH ROW

BEGIN
  SELECT ADM_FICHA_VEHICULOS_SEQ.NEXTVAL
  INTO   :new.FICHAVEHICULOID
  FROM   dual;
END;	    

/* Tabla para vales */
CREATE TABLE ADM_VALES(

    VALEID INTEGER NOT NULL,
    NO_VALE INTEGER NOT NULL,
    TALONARIO INTEGER NOT NULL,
    FECHA VARCHAR2(100) NOT NULL,
    HORA VARCHAR2(100) NOT NULL,
    GASOLINERA VARCHAR2(100) NOT NULL,
    RESPONSABLE INTEGER NOT NULL,
    COMISION VARCHAR2(1000) NOT NULL,
    INVENTARIOID INTEGER,
    ESTADO INTEGER NOT NULL,
    
    CONSTRAINT ADM_VALES_PK PRIMARY KEY (VALEID),
    
    CONSTRAINT ADM_VALES_EQP_INVENTARIO_FK
        FOREIGN KEY (INVENTARIOID)
        REFERENCES EQP_INVENTARIO(INVENTARIOID)

)

/* Secuencia para la tabla de vales */
CREATE SEQUENCE ADM_VALES_SEQ START WITH 1;

/* Trigger para insertar un nuevo ID en tabla de vales */
CREATE OR REPLACE TRIGGER ADM_VALES_BIR
BEFORE INSERT ON ADM_VALES
FOR EACH ROW

BEGIN
  SELECT ADM_VALES_SEQ.NEXTVAL
  INTO   :new.VALEID
  FROM   dual;
END;

/* Tabla Bitacora de Vehiculos */
CREATE TABLE ADM_BITACORA_VEHICULOS(

    BITACORAID INTEGER NOT NULL,
    FECHA VARCHAR2(100) NOT NULL,
    HORA VARCHAR2(100) NOT NULL,
    EVENTO VARCHAR2(100) NOT NULL,
    INVENTARIOID INTEGER NOT NULL,

    CONSTRAINT ADM_BITACORA_VEHICULOS_PK PRIMARY KEY (BITACORAID),

    CONSTRAINT ADMBITACORAV_EQP_INVENTARIO_FK
        FOREIGN KEY (INVENTARIOID)
        REFERENCES EQP_INVENTARIO(INVENTARIOID)

)

/* Secuencia para la tabla de Bitacora de Vehiculos */
CREATE SEQUENCE ADM_BITACORA_VEHICULOS_SEQ START WITH 1;

/* Trigger para insertar un nuevo ID en tabla de Bitacora de Vehiculos */
CREATE OR REPLACE TRIGGER ADM_BITACORA_VEHICULOS_BIR
BEFORE INSERT ON ADM_BITACORA_VEHICULOS
FOR EACH ROW

BEGIN
  SELECT ADM_BITACORA_VEHICULOS_SEQ.NEXTVAL
  INTO   :new.BITACORAID
  FROM   dual;
END;

/* Tabla Historia de Entradas y Salidas */
CREATE TABLE ADM_HISTORIAL_VEHICULOS(

    HISTORIALID INTEGER NOT NULL,
    FECHA VARCHAR2(100) NOT NULL,
    HORA_SALIDA VARCHAR2(100) NOT NULL,
    KM_SALIDA VARCHAR2(100) NOT NULL,
    HORA_ENTRADA VARCHAR2(100) NOT NULL,
    KM_ENTRADA VARCHAR2(100) NOT NULL,
    RESPONSABLE VARCHAR2(100) NOT NULL,
    OBSERVACION VARCHAR2(1000),
    INVENTARIOID INTEGER NOT NULL,

    CONSTRAINT ADM_HISTORIAL_VEHICULOS_PK PRIMARY KEY (HISTORIALID),

    CONSTRAINT HISTORIAL_EQP_INVENTARIO_FK
        FOREIGN KEY (INVENTARIOID)
        REFERENCES EQP_INVENTARIO(INVENTARIOID)

)

/* Secuencia para la tabla de Historial de Vehiculos */
CREATE SEQUENCE ADM_HISTORIAL_VEHICULOS_SEQ START WITH 1;

/* Trigger para insertar un nuevo ID en tabla de Historial de Vehiculos */
CREATE OR REPLACE TRIGGER ADM_HISTORIAL_VEHICULOS_BIR
BEFORE INSERT ON ADM_HISTORIAL_VEHICULOS
FOR EACH ROW

BEGIN
  SELECT ADM_HISTORIAL_VEHICULOS_SEQ.NEXTVAL
  INTO   :new.HISTORIALID
  FROM   dual;
END;

/* Tabla ADM_ESTADOSEGUIMIENTO */
CREATE TABLE ADM_ESTADOSEGUIMIENTO(

    ESTADOID INTEGER NOT NULL,
    NOMBRE VARCHAR2(100) NOT NULL,
    DESCRIPCION VARCHAR2(100),

    CONSTRAINT ADM_ESTADOSEGUIMIENTO_PK PRIMARY KEY (ESTADOID)

)

/* Secuencia para la tabla de ADM_ESTADOSEGUIMIENTO */
CREATE SEQUENCE ADM_ESTADOSEGUIMIENTO_SEQ START WITH 1;

/* Trigger para insertar un nuevo ID en tabla de ADM_ESTADOSEGUIMIENTO */
CREATE OR REPLACE TRIGGER ADM_ESEGUIMIENTO_BIR
BEFORE INSERT ON ADM_ESTADOSEGUIMIENTO
FOR EACH ROW

BEGIN
  SELECT ADM_ESTADOSEGUIMIENTO_SEQ.NEXTVAL
  INTO   :new.ESTADOID
  FROM   dual;
END;

/* Tabla ADM_ESTADO */
CREATE TABLE ADM_ESTADOS(

    ESTADOID INTEGER NOT NULL,
    NOMBRE VARCHAR2(100) NOT NULL,
    DESCRIPCION VARCHAR2(100),
    TIPO_ESTADOID INTEGER NOT NULL,

    CONSTRAINT ADM_ESTADOS_PK PRIMARY KEY (ESTADOID),

    CONSTRAINT ESTADOS_ESTADOSEGUIMIENTO_FK
        FOREIGN KEY (TIPO_ESTADOID)
        REFERENCES ADM_ESTADOSEGUIMIENTO(ESTADOID)

)

/* Secuencia para la tabla de ADM_ESTADOS */
CREATE SEQUENCE ADM_ESTADOS_SEQ START WITH 1;

/* Trigger para insertar un nuevo ID en tabla de ADM_ESTADOS */
CREATE OR REPLACE TRIGGER ADM_ESTADOS_BIR
BEFORE INSERT ON ADM_ESTADOS
FOR EACH ROW

BEGIN
  SELECT ADM_ESTADOS_SEQ.NEXTVAL
  INTO   :new.ESTADOID
  FROM   dual;
END;

/* Tabla ADM_CUOTAS_COMBUSTIBLE */
CREATE TABLE ADM_CUOTAS_COMBUSTIBLE(

  CUOTAID INTEGER NOT NULL,
  FECHA_INICIO VARCHAR2(100) NOT NULL,
  FECHA_FIN VARCHAR2(100) NOT NULL,
  CUOTA INTEGER NOT NULL,
  INVENTARIOID INTEGER NOT NULL,

  CONSTRAINT ADM_CUOTAS_PK PRIMARY KEY (CUOTAID),

  CONSTRAINT CUOTAS_EQP_INVENTARIO_FK
    FOREIGN KEY (INVENTARIOID)  
    REFERENCES EQP_INVENTARIO(INVENTARIOID)

);

CREATE SEQUENCE ADM_CUOTAS_COMBUSTIBLE_SEQ START WITH 1;

CREATE OR REPLACE TRIGGER ADM_CUOTAS_BIR
BEFORE INSERT ON ADM_CUOTAS_COMBUSTIBLE
FOR EACH ROW

BEGIN
  SELECT  ADM_CUOTAS_COMBUSTIBLE_SEQ.NEXTVAL
  INTO    :new.CUOTAID
  FROM    dual;
END;


/* Tabla ADM_ROLES */
CREATE TABLE ADM_ROLES(

  	ROLID INTEGER NOT NULL,
  	EMPLEADONIT VARCHAR2(100) NOT NULL,
  	FIRMA_REGISTRADA INTEGER,
    PILOTO INTEGER,

    CONSTRAINT ADM_ROLES_PK PRIMARY KEY (ROLID)

)

CREATE SEQUENCE ADM_ROLES_SEQ START WITH 1;

CREATE OR REPLACE TRIGGER ADM_ROLES_BIR
BEFORE INSERT ON ADM_ROLES
FOR EACH ROW

BEGIN
  SELECT  ADM_ROLES_SEQ.NEXTVAL
  INTO    :new.ROLID
  FROM    dual;
END;

CREATE TABLE TEMP_VALES(

	ID INTEGER,
  	SEMANA INTEGER,
  	NO_PLACA VARCHAR2(100),
  	INVENTARIO INTEGER,
  	NO_GESTION INTEGER, 
  	NO_VALE INTEGER,
  	FECHA VARCHAR2(100),
  	GALONES_ASIGNADOS INTEGER,
  	GALONES SERVIDOS INTEGER,
  	GALONES_DISPONIBLES INTEGER,
  	KILOMETRAJE INTEGER,
  	RESPONSABLE VARCHAR2(100),
  	PILOTO VARCHAR2(100),
  	OBSERVACIONES VARCHAR2(100)

)

/* Tabla para Documentos */
CREATE TABLE ADM_DOCUMENTOS{
	
	DOCUMENTOID INTEGER NOT NULL,
	NOMBRE VARCHAR2(100) NOT NULL,
	DESCRIPCION VARCHAR2(100),
	ARCHIVO VARCHAR2(100) NOT NULL,
	INVENTARIOID INTEGER NOT NULL,

	CONSTRAINT ADM_DOCUMENTOS_PK PRIMARY KEY (DOCUMENTOID),

	CONSTRAINT DOCUMENTOS_EQP_INVENTARIO_FK
    FOREIGN KEY (INVENTARIOID)  
    REFERENCES EQP_INVENTARIO(INVENTARIOID)

}

CREATE SEQUENCE ADM_DOCUMENTOS_SEQ START WITH 1;

CREATE OR REPLACE TRIGGER ADM_DOCUMENTOS_BIR
BEFORE INSERT ON ADM_DOCUMENTOS
FOR EACH ROW

BEGIN
  SELECT  ADM_DOCUMENTOS_SEQ.NEXTVAL
  INTO    :new.DOCUMENTOID
  FROM    dual;
END;

/* Tabla Detalles de Salida */
CREATE TABLE ADM_DETALLE_SALIDA(

	DETALLEID INTEGER NOT NULL,
	HISTORIALID INTEGER NOT NULL,
	TIPO_DETALLESALIDAID INTEGER NOT NULL,
	VALOR VARCHAR2(100),

	CONSTRAINT ADM_DETALLE_SALIDA_PK PRIMARY KEY (DETALLEID),

	CONSTRAINT DETALLE_HISTORIAL_FK
	FOREIGN KEY (HISTORIALID)
	REFERENCES ADM_HISTORIAL_VEHICULOS(HISTORIALID),

	CONSTRAINT TIPO_DETALLE_FK
	FOREIGN KEY (TIPO_DETALLESALIDAID)
	REFERENCES ADM_TIPO_DETALLE_SALIDA(TIPO_DETALLE_SALIDA_ID)	 	 

)

CREATE SEQUENCE ADM_DETALLE_SALIDA_SQ START WITH 1;

CREATE OR REPLACE TRIGGER ADM_DETALLE_SALIDA_BIR
BEFORE INSERT ON ADM_DETALLE_SALIDA
FOR EACH ROW

BEGIN 
	SELECT 	ADM_DETALLE_SALIDA_SQ.NEXTVAL
	INTO 	:new.DETALLEID
	FROM 	dual;
END;	

/* Tabla Tipo Detalle Salida */
CREATE TABLE ADM_TIPO_DETALLE_SALIDA(

	TIPO_DETALLE_SALIDA_ID INTEGER NOT NULL,
	NOMBRE VARCHAR2(100) NOT NULL,
	DESCRIPCION VARCHAR2(1000),

	CONSTRAINT ADM_TIPO_DETALLE_SALIDA_PK PRIMARY KEY (TIPO_DETALLE_SALIDA_ID)

)

CREATE SEQUENCE ADM_TIPO_DETALLE_SALIDA_SQ START WITH 1;

CREATE OR REPLACE TRIGGER ADM_TIPO_DETALLE_SALIDA_BIR
BEFORE INSERT ON ADM_TIPO_DETALLE_SALIDA
FOR EACH ROW 

BEGIN 
	SELECT	ADM_TIPO_DETALLE_SALIDA_SQ.NEXTVAL
	INTO 	:new.TIPO_DETALLE_SALIDA_ID
	FROM	dual;
END;





INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '02/01/2018', '05/01/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('02/01/2018', 'dd/mm/yy') AND TO_DATE('05/01/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '08/01/2018', '12/01/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('08/01/2018', 'dd/mm/yy') AND TO_DATE('12/01/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '15/01/2018', '19/01/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('15/01/2018', 'dd/mm/yy') AND TO_DATE('19/01/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '22/01/2018', '26/01/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('22/01/2018', 'dd/mm/yy') AND TO_DATE('26/01/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '29/01/2018', '31/01/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('29/01/2018', 'dd/mm/yy') AND TO_DATE('31/01/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '02/02/2018', '03/02/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('02/02/2018', 'dd/mm/yy') AND TO_DATE('03/02/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '05/02/2018', '09/02/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('05/02/2018', 'dd/mm/yy') AND TO_DATE('09/02/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '12/02/2018', '16/02/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('12/02/2018', 'dd/mm/yy') AND TO_DATE('16/02/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '19/02/2018', '23/02/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('19/02/2018', 'dd/mm/yy') AND TO_DATE('23/02/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;

INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO)
SELECT '26/02/2018', '28/02/2018', CUOTA, 2055, 0 FROM ADM_VALES 
WHERE FECHA 
BETWEEN TO_DATE('26/02/2018', 'dd/mm/yy') AND TO_DATE('28/02/2018', 'dd/mm/yy')
AND INVENTARIOID = 2055 AND ROWNUM = 1;