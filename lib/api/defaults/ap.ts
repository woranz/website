import type {
  PropuestaTomadorInput,
  PropuestaAseguradoInput,
} from "@/lib/api/schemas/ap"

export const USER_DEFAULT = {
  idTipoPersona: 1,
  idCondFiscal: 1,
  entidadPublica: false,
  idEstadoCivil: 1,
  idTipoBeneficiario: 4,
  idTipoSociedad: 1,
  idTipoDocumento: 1,
  idSexo: 2,
  numeroDocumento: 0,
  cuit: '',
  nombre: '',
  apellido: '',
  fechaNacimiento: '2000-08-26',
  domicilio: {
    calle: 'Calle',
    numero: 0,
    piso: '',
    departamento: '',
    idProvincia: 1,
    codigoPostal: '1006',
    localidad: 'C.A.B.A.',
    idCodigoPostal: 0,
  },
};

export const QUOTE_DEFAULT = {
  idVigencia: 17,
  vigenciaDesde: '',
  vigenciaHasta: '',
  idPlanComercial: 1218,
  idCoberturaPaquete: 0,
  items: [
    {
      idOcupacion: 0,
      cantidad: 0,
    },
  ],
  idProvinciaRiesgo: 0,
  idPersonaTipo: 1,
  idCondicionFiscal: 1,
  idFormaCobro: 1,
  solicitante: '',
  mail: '',
  telefonoArea: 0,
  telefonoNumero: 0,
  observaciones: '',
};

export const POLICY_DEFAULT = {
  referencia: 'Pago desde MercadoPago',
  detalleRiesgo: '',
  formaCobro: {
    idFormaCobro: 1,
    idTarjetaEmpresa: 0,
    idTipoCuentaBancaria: 0,
    cbu: 0,
    numeroTarjeta: '',
    fechaVTOTarjeta: '2022-12-31',
  },
};

export function applyTomadorDefaults(tomador: PropuestaTomadorInput): Record<string, unknown> {
  const t = tomador as Record<string, unknown>

  if (t.idTipoPersona === 2) {
    return {
      idTipoPersona: 2,
      idTipoDocumento: (t.idTipoDocumento as number) ?? USER_DEFAULT.idTipoDocumento,
      cuit: t.cuit as string,
      razonSocial: t.razonSocial as string,
      idCondFiscal: (t.idCondFiscal as number) ?? USER_DEFAULT.idCondFiscal,
      idTipoSociedad: (t.idTipoSociedad as number) ?? USER_DEFAULT.idTipoSociedad,
      entidadPublica: (t.entidadPublica as boolean) ?? USER_DEFAULT.entidadPublica,
      domicilio: (t.domicilio as Record<string, unknown>) ?? USER_DEFAULT.domicilio,
      emails: t.emails ?? [],
    }
  }

  return {
    idTipoPersona: USER_DEFAULT.idTipoPersona,
    idTipoDocumento: (t.idTipoDocumento as number) ?? USER_DEFAULT.idTipoDocumento,
    numeroDocumento: t.numeroDocumento as number,
    cuit: (t.cuit as string) || USER_DEFAULT.cuit,
    nombre: t.nombre as string,
    apellido: t.apellido as string,
    idSexo: (t.idSexo as number) ?? USER_DEFAULT.idSexo,
    fechaNacimiento: (t.fechaNacimiento as string) || USER_DEFAULT.fechaNacimiento,
    idEstadoCivil: (t.idEstadoCivil as number) ?? USER_DEFAULT.idEstadoCivil,
    idCondFiscal: (t.idCondFiscal as number) ?? USER_DEFAULT.idCondFiscal,
    idTipoSociedad: (t.idTipoSociedad as number) ?? USER_DEFAULT.idTipoSociedad,
    entidadPublica: (t.entidadPublica as boolean) ?? USER_DEFAULT.entidadPublica,
    domicilio: (t.domicilio as Record<string, unknown>) ?? USER_DEFAULT.domicilio,
    emails: t.emails ?? [],
  }
}

export function applyAseguradoDefaults(asegurado: PropuestaAseguradoInput): Record<string, unknown> {
  const a = asegurado as Record<string, unknown>

  if (a.idTipoPersona === 2) {
    return {
      idTipoPersona: 2,
      idTipoDocumento: (a.idTipoDocumento as number) ?? USER_DEFAULT.idTipoDocumento,
      cuit: a.cuit as string,
      razonSocial: a.razonSocial as string,
      idOcupacion: a.idOcupacion as number,
      idTipoBeneficiario: (a.idTipoBeneficiario as number) ?? USER_DEFAULT.idTipoBeneficiario,
    }
  }

  return {
    idTipoDocumento: (a.idTipoDocumento as number) ?? USER_DEFAULT.idTipoDocumento,
    numeroDocumento: a.numeroDocumento as number,
    cuit: (a.cuit as string) || USER_DEFAULT.cuit,
    nombre: a.nombre as string,
    apellido: a.apellido as string,
    idOcupacion: a.idOcupacion as number,
    idSexo: (a.idSexo as number) ?? USER_DEFAULT.idSexo,
    fechaNacimiento: (a.fechaNacimiento as string) || USER_DEFAULT.fechaNacimiento,
    idEstadoCivil: (a.idEstadoCivil as number) ?? USER_DEFAULT.idEstadoCivil,
    idTipoBeneficiario: (a.idTipoBeneficiario as number) ?? USER_DEFAULT.idTipoBeneficiario,
    beneficiarios: (a.beneficiarios as unknown[]) ?? [],
  }
}
