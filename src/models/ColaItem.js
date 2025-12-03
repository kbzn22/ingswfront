export function mapColaItem(dto) {
  return {
    idIngreso: dto.ingresoId,
    nombre: dto.nombre,
    apellido: dto.apellido,
    cuil: dto.cuil,
    nivel: dto.nivel,
    estado: dto.estado,
    nombreNivel: dto.nombreNivel,
    fechaIngreso: dto.fechaIngreso,
  };
}
