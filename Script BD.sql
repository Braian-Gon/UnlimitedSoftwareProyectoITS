-- Unlimited Software Database Script
-- drop database api_us;
-- drop user 'AdministradorBD'@'localhost';
-- drop user 'api-web'@'localhost';
-- Base de datos
create database if not exists api_us;
use api_us;

-- Tablas
create table horario (
nombre varchar(50) primary key,
entrada time not null,
salida time not null,
pausa int default 0,
estado enum('Activo', 'Desactivado') default 'Activo');

create table cuenta (
id int auto_increment primary key,
correo varchar(100) unique not null,
contraseña varchar(100) not null,
horario varchar(50) null,
rol enum('Funcionario', 'Supervisor', 'Administrador'),
estado enum('Activo', 'Desactivado', 'Inactivo') default 'Inactivo',
token varchar(100),
foreign key (horario) references horario(nombre),
fulltext index indice_correo (correo, contraseña))
ENGINE=InnoDB;

create table marca(
id int auto_increment,
empleado_id int,
tipo enum ('Entrada', 'Salida', 'Pausa', 'Regreso'),
fecha_hora datetime default now(),
observacion varchar(200),
estado enum('Activo', 'Reportado', 'Verificado', 'Desactivado') default 'Activo',
foreign key (empleado_id) references cuenta(id),
primary key (id, empleado_id));

create table supervisa(
empleado_id int primary key,
supervisor_id int null,
foreign key (empleado_id) references cuenta(id),
foreign key (supervisor_id) references cuenta(id));

create table inicio_fin (
inicio_id int primary key,
fin_id int null,
foreign key (inicio_id) references marca(id),
foreign key(fin_id) references marca(id));

create table reportes(
id int auto_increment primary key,
empleado_id int not null,
supervisor_id int not null,
horas_trabajadas int not null,
horas_maximas int not null,
pausa_realizadas int not null,
pausas_maximas int not null,
asistencia int not null,
fecha_reporte datetime default now(),
estado enum('Activo', 'Desactivado') default 'Activo'
)Engine ARCHIVE;

-- Vistas

create view V_Trabajo(id, minutos_t, fecha) as 
select a.empleado_id, TIMESTAMPDIFF(minute, a.fecha_hora , b.fecha_hora) minutos_trabajados,  DATE_FORMAT(a.fecha_hora, '%Y-%m-%d') dia
from inicio_fin, marca a, marca b
where inicio_id = a.id and fin_id = b.id and a.tipo = 'Entrada' and b.tipo = 'Salida' and a.estado != 'Desactivado' and a.estado != 'Reportado' and b.estado != 'Desactivado' and b.estado != 'Reportado';


create view V_Pausa(id, minutos_p, fecha) as 
select a.empleado_id, TIMESTAMPDIFF(minute, a.fecha_hora , b.fecha_hora) minutos_de_pausa,  DATE_FORMAT(a.fecha_hora, '%Y-%m-%d') dia
from inicio_fin, marca a, marca b
where inicio_id = a.id and fin_id = b.id and a.tipo = 'Pausa' and b.tipo = 'Regreso' and a.estado != 'Desactivado' and a.estado != 'Reportado' and b.estado != 'Desactivado' and b.estado != 'Reportado';

create view V_Usuarios as
select id, correo, rol, horario, supervisor_id,  supervisor, estado from cuenta
left join (select empleado_id,cuenta.id supervisor_id, cuenta.correo supervisor from cuenta, supervisa 
where cuenta.rol = 'Supervisor' and cuenta.id = supervisa.supervisor_id) b
on b.empleado_id = cuenta.id 
where rol != 'Administrador' and estado != 'Desactivado';

create view V_Supervisores as
select id, correo from cuenta
where rol = 'Supervisor' and estado = 'Activo';

create view V_asistencias(asistencias) as
select count( distinct empleado_id) from marca
where DATE_FORMAT(fecha_hora, '%Y-%m-%d') = DATE_FORMAT(now(), '%Y-%m-%d') and tipo = 'Entrada' and estado != 'Desactivado';

create view V_funcionarios(total) as
select count(id) from cuenta 
where rol = 'Funcionario' and estado = 'Activo';	

create view V_reportes_semanal as
select reportes.id, supervisor_id, cuenta.correo correo, horas_trabajadas, horas_maximas, pausa_realizadas, pausas_maximas, asistencia, fecha_reporte from cuenta, reportes
where cuenta.id = reportes.empleado_id and reportes.estado != 'Desactivado';

create view v_reportes_todos as
SELECT 
        `reportes`.`id` AS `id`,
        `b`.`correo` AS `scorreo`,
        `a`.`correo` AS `fcorreo`,
        `reportes`.`horas_trabajadas` AS `horas_trabajadas`,
        `reportes`.`horas_maximas` AS `horas_maximas`,
        `reportes`.`pausa_realizadas` AS `pausa_realizadas`,
        `reportes`.`pausas_maximas` AS `pausas_maximas`,
        `reportes`.`asistencia` AS `asistencia`,
        `reportes`.`fecha_reporte` AS `fecha_reporte`
    FROM
        ((`cuenta` `a`
        JOIN `cuenta` `b`)
        JOIN `reportes`)
    WHERE
        ((`a`.`id` = `reportes`.`empleado_id`)
            AND (`b`.`id` = `reportes`.`supervisor_id`)
            AND (`reportes`.`estado` <> 'Desactivado'));
            
-- Triggers

DELIMITER //
CREATE TRIGGER T_Pausa AFTER INSERT ON marca
FOR EACH ROW
BEGIN
	IF NEW.tipo = 'Pausa' THEN
		insert into inicio_fin (inicio_id) value (NEW.id);
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Entrada AFTER INSERT ON marca
FOR EACH ROW
BEGIN
	IF NEW.tipo = 'Entrada' THEN
		insert into inicio_fin (inicio_id) value (NEW.id);
    END IF;
END; //


DELIMITER //
CREATE TRIGGER T_Contraseña BEFORE UPDATE ON cuenta
FOR EACH ROW
BEGIN
	IF NEW.contraseña = '' or NEW.contraseña is null THEN
		set new.contraseña = old.contraseña;
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Regreso before INSERT ON marca
FOR EACH ROW
BEGIN
		set @regreso = (select inicio_id from marca, inicio_fin
		where
		inicio_id = id and tipo = 'Pausa' and empleado_id = new.empleado_id and fin_id is null and marca.estado != 'Desactivado');

	IF NEW.tipo = 'Regreso' and @regreso is null THEN
		signal SQLSTATE '45000';
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Regreso_Update after INSERT ON marca
FOR EACH ROW
BEGIN
		set @regreso = (select inicio_id from marca, inicio_fin
		where
		inicio_id = id and tipo = 'Pausa' and empleado_id = new.empleado_id and fin_id is null and marca.estado != 'Desactivado');

	IF NEW.tipo = 'Regreso' THEN
		update inicio_fin
		set  fin_id = NEW.id
		where inicio_id = @regreso;
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Salida before INSERT ON marca
FOR EACH ROW
BEGIN
		set @salida = (select inicio_id from marca, inicio_fin
		where
		inicio_id = id and tipo = 'Entrada' and empleado_id = new.empleado_id and fin_id is null and marca.estado != 'Desactivado');

	IF NEW.tipo = 'Salida' and @salida is null THEN
		signal SQLSTATE '45000';
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Salida_Update after INSERT ON marca
FOR EACH ROW
BEGIN
		set @salida = (select inicio_id from marca, inicio_fin
		where
		inicio_id = id and tipo = 'Entrada' and empleado_id = new.empleado_id and fin_id is null and marca.estado != 'Desactivado');

	IF NEW.tipo = 'Salida' THEN
		update inicio_fin
		set  fin_id = NEW.id
		where inicio_id = @salida;
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Existe_Entrada BEFORE INSERT ON marca
FOR EACH ROW
BEGIN
	set @entrada = (select inicio_id from marca, inicio_fin
		where
		inicio_id = marca.id and tipo = 'Entrada' and empleado_id = NEW.empleado_id and fin_id is null and marca.estado != 'Desactivado');
	IF NEW.tipo = 'Entrada' and @entrada is not null THEN
		signal SQLSTATE '45000';
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Existe_Pausa BEFORE INSERT ON marca
FOR EACH ROW
BEGIN
	set @pausa = (select inicio_id from marca, inicio_fin
		where
		inicio_id = marca.id and tipo = 'Pausa' and empleado_id = NEW.empleado_id and fin_id is null and marca.estado != 'Desactivado');
	IF NEW.tipo = 'Pausa' and @pausa is not null THEN
		signal SQLSTATE '45000';
    END IF;
END; //

DELIMITER //
CREATE TRIGGER T_Reportar_Entrada_Salida BEFORE INSERT ON marca
FOR EACH ROW
BEGIN
	set @entrada = (select entrada from horario,cuenta
		where horario = nombre and id=new.empleado_id);
        
	set @salida = (select salida from horario,cuenta
		where horario = nombre and id=new.empleado_id);
        
	set @pausa_regreso = (select nombre from horario,cuenta 
		where horario = nombre and cuenta.id=new.empleado_id and TIME_FORMAT(new.fecha_hora, '%H:%i:%s') between entrada and salida);
    
	IF NEW.tipo = 'Entrada' and (TIMEDIFF(TIME_FORMAT(new.fecha_hora, '%H:%i:%s'), TIME_FORMAT(@entrada, '%H:%i:%s')) > '00:05:00' 
								or
								TIMEDIFF(TIME_FORMAT(@entrada, '%H:%i:%s'), TIME_FORMAT(new.fecha_hora, '%H:%i:%s')) > '00:05:00' ) 
	THEN
		set new.estado = 'Reportado';
	ELSEIF NEW.tipo = 'Salida' and (TIMEDIFF(TIME_FORMAT(new.fecha_hora, '%H:%i:%s'), TIME_FORMAT(@salida, '%H:%i:%s')) > '00:05:00' 
								or
								TIMEDIFF(TIME_FORMAT(@salida, '%H:%i:%s'), TIME_FORMAT(new.fecha_hora, '%H:%i:%s')) > '00:05:00' ) 
	THEN
		set new.estado = 'Reportado';
	ELSEIF (new.tipo = 'Pausa' or new.tipo = 'Regreso') and @pausa_regreso is null then
		set new.estado = 'Reportado';
    END IF;
END; //

-- Procedimientos

DELIMITER //
create procedure P_eliminar_usuario (IN id_borrar INT)
begin
set @rol = (select rol from cuenta where id = id_borrar);
if @rol = 'Funcionario' then
	update cuenta 
    set estado = 'Desactivado'
	where id = id_borrar;
elseif @rol = 'Supervisor' then
	update cuenta 
    INNER JOIN supervisa ON cuenta.id = supervisa.supervisor_id
    set cuenta.estado = 'Desactivado',
    supervisa.supervisor_id = null
    where cuenta.id = id_borrar;
end if;
END;//

Delimiter //
create procedure P_crear_funcionario (in mail varchar(50), in passwd varchar(100), in nombre varchar(50), in rol_trabajo varchar(20), in supervisor int, in token_c varchar(100))
begin
	insert into cuenta(correo, contraseña, horario, rol, token) value (mail, passwd, nombre, rol_trabajo, token_c);
    set @id = last_insert_id();
    if supervisor is not null then
		insert into supervisa value (@id, supervisor);
	else 
		insert into supervisa (empleado_id) value (@id);
	end if;
end;//

Delimiter //
create procedure P_reporte_semanal(in supervisor INT)
begin
CREATE TEMPORARY TABLE trabajo_temporal AS
select supervisa.empleado_id empleado_id, supervisa.supervisor_id supervisor_id, sum(TIMESTAMPDIFF(minute, a.fecha_hora , b.fecha_hora)) minutos_trabajados, TIMESTAMPDIFF(minute, entrada , salida) minutos_maximos, DATE_FORMAT(a.fecha_hora, '%Y-%m-%d') dia
from cuenta, supervisa, inicio_fin, marca a, marca b, horario
where
cuenta.id = supervisa.empleado_id and supervisa.empleado_id = a.empleado_id and supervisa.empleado_id = b.empleado_id and cuenta.horario = horario.nombre and
inicio_id = a.id and fin_id = b.id and a.tipo = 'Entrada' and b.tipo = 'Salida' and a.estado != 'Desactivado' and a.estado != 'Reportado' and b.estado != 'Desactivado' and b.estado != 'Reportado'
group by dia, supervisa.empleado_id ; 

create temporary table pausa_temporal as
select supervisa.empleado_id empleado_id, supervisa.supervisor_id supervisor_id, sum(TIMESTAMPDIFF(minute, a.fecha_hora , b.fecha_hora)) pausas_realizadas, horario.pausa pausa, DATE_FORMAT(a.fecha_hora, '%Y-%m-%d') dia
from cuenta, supervisa, inicio_fin, marca a, marca b, horario
where
cuenta.id = supervisa.empleado_id and supervisa.empleado_id = a.empleado_id and supervisa.empleado_id = b.empleado_id and cuenta.horario = horario.nombre and
inicio_id = a.id and fin_id = b.id and a.tipo = 'Pausa' and b.tipo = 'Regreso' and  a.estado != 'Desactivado' and a.estado != 'Reportado' and b.estado != 'Desactivado' and b.estado != 'Reportado'
group by dia, supervisa.empleado_id ; 

create temporary table reporte_diario as
select t.empleado_id, t.supervisor_id, minutos_trabajados, minutos_maximos, pausas_realizadas, pausa, t.dia 
from trabajo_temporal t
left join pausa_temporal p
on t.empleado_id = p.empleado_id and t.dia = p.dia;

insert into reportes (empleado_id, supervisor_id, horas_trabajadas, horas_maximas, pausa_realizadas, pausas_maximas,asistencia)
select empleado_id, supervisor_id, COALESCE(sum(minutos_trabajados),0), COALESCE(sum(minutos_maximos),0), COALESCE(sum(pausas_realizadas),0), COALESCE(sum(pausa),0), COALESCE(count(empleado_id),0) asistencia from reporte_diario
where week(dia) = week(now()) and year(dia) = year(now())
group by empleado_id, supervisor_id;
drop table trabajo_temporal, pausa_temporal, reporte_diario;
end;//

-- Usuarios

CREATE USER 'AdministradorBD'@'localhost' IDENTIFIED BY 'prueba';
GRANT ALL PRIVILEGES ON api_us.* TO 'AdministradorBD'@'localhost';

CREATE USER 'api-web'@'localhost' IDENTIFIED BY 'prueba';
GRANT SELECT, UPDATE, INSERT ON api_us.cuenta TO 'api-web'@'localhost';
GRANT SELECT, UPDATE, INSERT ON api_us.horario TO 'api-web'@'localhost';
GRANT SELECT, UPDATE, INSERT ON api_us.inicio_fin TO 'api-web'@'localhost';
GRANT SELECT, UPDATE, INSERT ON api_us.marca TO 'api-web'@'localhost';
GRANT SELECT, UPDATE, INSERT ON api_us.supervisa TO 'api-web'@'localhost';
GRANT SELECT, INSERT ON api_us.reportes TO 'api-web'@'localhost';
GRANT EXECUTE ON PROCEDURE api_us.P_crear_funcionario TO 'api-web'@'localhost';
GRANT EXECUTE ON PROCEDURE api_us.P_eliminar_usuario TO 'api-web'@'localhost';
GRANT EXECUTE ON PROCEDURE api_us.P_reporte_semanal TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_asistencias TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_funcionarios TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_pausa TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_reportes_semanal TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_reportes_todos TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_supervisores TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_supervisores TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_trabajo TO 'api-web'@'localhost';
GRANT SELECT ON api_us.v_usuarios TO 'api-web'@'localhost';
GRANT CREATE TEMPORARY TABLES ON api_us.* TO 'api-web'@'localhost';

FLUSH PRIVILEGES;

-- Datos de prueba

insert into horario (nombre, entrada, salida, pausa) values ('Matutino', '07:00:00', '14:00:00', 40), ('Vespertino', '14:30:00', '19:00:00', 40), ('Nocturno', '19:30:00', '04:00:00', 30);

insert into cuenta (correo, contraseña, rol, estado) values
('administrador@unlimited.com', '$2y$10$4OGfsd8nzafv/hhqy7ecHeidDab5ZoNnyvTV8Z4qJLV1BIHK0jHUG', 'Administrador', 'Activo'),
('roberto@unlimited.com', '$2y$10$4OGfsd8nzafv/hhqy7ecHeidDab5ZoNnyvTV8Z4qJLV1BIHK0jHUG', 'Supervisor', 'Activo');

insert into cuenta (correo, contraseña, horario, rol, estado) values
('pablo@unlimited.com', '$2y$10$4OGfsd8nzafv/hhqy7ecHeidDab5ZoNnyvTV8Z4qJLV1BIHK0jHUG', 'Matutino', 'Funcionario', 'Activo'),
('gonzalo@unlimited.com', '$2y$10$4OGfsd8nzafv/hhqy7ecHeidDab5ZoNnyvTV8Z4qJLV1BIHK0jHUG', 'Vespertino', 'Funcionario', 'Activo'),
('agustin@unlimited.com', '$2y$10$4OGfsd8nzafv/hhqy7ecHeidDab5ZoNnyvTV8Z4qJLV1BIHK0jHUG', 'Nocturno', 'Funcionario', 'Activo');

insert into marca (empleado_id, tipo, fecha_hora) values 
(3, 'Entrada', '2025-11-17 07:00:00'),
(3, 'Pausa', '2025-11-17 12:00:00'),
(3, 'Regreso', '2025-11-17 12:30:00'),
(3, 'Salida', '2025-11-17 14:00:00'),
(3, 'Entrada', '2025-11-18 07:00:00'),
(3, 'Pausa', '2025-11-18 12:00:00'),
(3, 'Regreso', '2025-11-18 12:30:00'),
(3, 'Salida', '2025-11-18 14:00:00'),
(3, 'Entrada', '2025-11-19 07:00:00'),
(3, 'Pausa', '2025-11-19 12:00:00'),
(3, 'Regreso', '2025-11-19 12:30:00'),
(3, 'Salida', '2025-11-19 14:00:00'),
(3, 'Entrada', '2025-11-21 07:00:00'),
(3, 'Pausa', '2025-11-21 12:00:00'),
(3, 'Regreso', '2025-11-21 12:30:00'),
(3, 'Salida', '2025-11-21 14:00:00');

insert into marca (empleado_id, tipo, fecha_hora) values 
(4, 'Entrada', '2025-11-17 14:30:00'),
(4, 'Pausa', '2025-11-17 16:00:00'),
(4, 'Regreso', '2025-11-17 16:30:00'),
(4, 'Salida', '2025-11-17 19:00:00'),
(4, 'Entrada', '2025-11-18 14:30:00'),
(4, 'Pausa', '2025-11-18 16:00:00'),
(4, 'Regreso', '2025-11-18 16:30:00'),
(4, 'Salida', '2025-11-18 19:00:00'),
(4, 'Entrada', '2025-11-19 14:30:00'),
(4, 'Pausa', '2025-11-19 16:00:00'),
(4, 'Regreso', '2025-11-19 16:30:00'),
(4, 'Salida', '2025-11-19 19:00:00'),
(4, 'Entrada', '2025-11-20 14:30:00'),
(4, 'Pausa', '2025-11-20 16:00:00'),
(4, 'Regreso', '2025-11-20 16:30:00'),
(4, 'Salida', '2025-11-20 19:00:00');

insert into marca (empleado_id, tipo, fecha_hora) values 
(5, 'Entrada', '2025-11-17 19:30:00'),
(5, 'Pausa', '2025-11-17 00:00:00'),
(5, 'Regreso', '2025-11-17 00:30:00'),
(5, 'Salida', '2025-11-18 04:00:00'),
(5, 'Entrada', '2025-11-18 19:30:00'),
(5, 'Pausa', '2025-11-18 00:00:00'),
(5, 'Regreso', '2025-11-18 00:30:00'),
(5, 'Salida', '2025-11-19 04:00:00'),
(5, 'Entrada', '2025-11-19 19:30:00'),
(5, 'Pausa', '2025-11-19 00:00:00'),
(5, 'Regreso', '2025-11-19 00:30:00'),
(5, 'Salida', '2025-11-20 04:00:00'),
(5, 'Entrada', '2025-11-21 19:30:00'),
(5, 'Pausa', '2025-11-21 16:00:00'),
(5, 'Regreso', '2025-11-21 00:30:00'),
(5, 'Salida', '2025-11-22 04:00:00');