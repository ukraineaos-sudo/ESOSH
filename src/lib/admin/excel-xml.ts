/** RU: Екранування для SpreadsheetML. EN: Escape text for SpreadsheetML. */
export function excelXmlText(value: unknown): string {
  const s = value == null ? "" : String(value);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type ExcelXmlColumn = {
  header: string;
  width: number;
};

/**
 * RU: Excel XML 2003 (SpreadsheetML) без залежностей — коректна UTF-8, ширини колонок.
 * EN: Dependency-free SpreadsheetML workbook for Excel.
 */
export function buildExcelXmlWorkbook(params: {
  sheetName: string;
  columns: ExcelXmlColumn[];
  rows: unknown[][];
}): string {
  const sheet = excelXmlText(params.sheetName).slice(0, 31) || "Sheet1";
  const colXml = params.columns
    .map((col) => `<Column ss:AutoFitWidth="0" ss:Width="${col.width}"/>`)
    .join("");

  const headerCells = params.columns
    .map(
      (col) =>
        `<Cell ss:StyleID="header"><Data ss:Type="String">${excelXmlText(col.header)}</Data></Cell>`,
    )
    .join("");

  const body = params.rows
    .map((row) => {
      const cells = params.columns
        .map((_, index) => {
          const raw = row[index];
          if (typeof raw === "number" && Number.isFinite(raw)) {
            return `<Cell><Data ss:Type="Number">${raw}</Data></Cell>`;
          }
          return `<Cell><Data ss:Type="String">${excelXmlText(raw)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Calibri" ss:Size="11"/>
  </Style>
  <Style ss:ID="header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>
   <Interior ss:Color="#D9E2F3" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sheet}">
  <Table>${colXml}<Row>${headerCells}</Row>${body}</Table>
 </Worksheet>
</Workbook>`;
}

/** RU: Дата/час для Excel (Europe/Kyiv). EN: Local date-time for Excel (Kyiv). */
export function formatExcelDateTimeKyiv(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}
