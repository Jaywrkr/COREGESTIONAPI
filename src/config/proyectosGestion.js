import * as glide from "@glideapps/tables";

export const proyectosGestionTable = glide.table({
    token: "62348300-4244-472c-a615-920f130c9d51",
    app: "EqmJ7p1vk6juaq1aLmXi",
    table: "native-table-xtxrom6pVynTPD5o42Ja",
    columns: {
        column1: { type: "string", name: "remotecolumn1" },
        column2: { type: "string", name: "remotecolumn2" },
        administraciN: { type: "string", name: "remoteADMINISTRACIÓN" },
        column4: { type: "string", name: "remotecolumn4" },
        column5: { type: "string", name: "remotecolumn5" },
        column6: { type: "date-time", name: "remotecolumn6" },
        column7: { type: "date-time", name: "remotecolumn7" },
        column8: { type: "number", name: "remotecolumn8" },
        column9: { type: "date-time", name: "remotecolumn9" },
        column10: { type: "date-time", name: "remotecolumn10" },
        fechaActa: { type: "date-time", name: "remotecolumn11" },
        column12: { type: "string", name: "remotecolumn12" },
        column13: { type: "string", name: "remotecolumn13" },
        cDigoFoAd03: { type: "string", name: "remoteCódigo:FO-AD-03" },
        column15: { type: "string", name: "remotecolumn15" },
        addendum: { type: "string", name: "K70sp" },
        formaDePago: { type: "string", name: "A4jRq" },
        fechaAdjudicacionOrden: { type: "date-time", name: "2IC5E" },
        fechaAnticipo: { type: "date-time", name: "U3mii" },
        administrador: { type: "string", name: "qh4Yu" },
        adjudicacion: { type: "boolean", name: "dtDJM" },
        actaDeNegociacion: { type: "boolean", name: "5US2d" },
        contrato: { type: "boolean", name: "zdIXP" },
        polizaFiel: { type: "boolean", name: "XZmfv" },
        polizaBuen: { type: "boolean", name: "x5KAj" },
        horasPost: { type: "boolean", name: "dEVN0" },
        mantenimientos: { type: "boolean", name: "hgrW5" },
        trasnferenciaTecnologia: { type: "boolean", name: "6gqsL" },
        certificadoParticipacion: { type: "boolean", name: "iyN8a" },
        actaEntregaRecepcion: { type: "boolean", name: "7ExHm" },
        urlCaratula: { type: "uri", name: "SqS5P" }
    }
});

// Mapeo de nombres legibles para columnas
export const columnLabels = {
    column1: "Código Proyecto",
    column2: "Nombre Proyecto",
    administraciN: "Administración",
    column4: "Cliente",
    column5: "Estado",
    column6: "Fecha Inicio",
    column7: "Fecha Fin Planificada",
    column8: "Valor",
    column9: "Fecha Firma Contrato",
    column10: "Fecha Entrega",
    fechaActa: "Fecha Acta",
    column12: "Responsable",
    column13: "Observaciones",
    cDigoFoAd03: "Código FO-AD-03",
    column15: "Tipo Proyecto",
    addendum: "Addendum",
    formaDePago: "Forma de Pago",
    fechaAdjudicacionOrden: "Fecha Adjudicación",
    fechaAnticipo: "Fecha Anticipo",
    administrador: "Administrador",
    adjudicacion: "Adjudicación Completada",
    actaDeNegociacion: "Acta de Negociación",
    contrato: "Contrato Firmado",
    polizaFiel: "Póliza Fiel",
    polizaBuen: "Póliza Buen Uso",
    horasPost: "Horas Post Implementación",
    mantenimientos: "Mantenimientos",
    trasnferenciaTecnologia: "Transferencia Tecnología",
    certificadoParticipacion: "Certificado Participación",
    actaEntregaRecepcion: "Acta Entrega-Recepción",
    urlCaratula: "URL Carátula"
};

// Estados posibles
export const estadosPosibles = [
    "Por Iniciar",
    "En Curso",
    "En Validación",
    "Completado",
    "Cancelado",
    "Suspendido"
];

export default proyectosGestionTable;
