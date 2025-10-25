package com.umg.proyectoanalisis.controller.cuentaporcobrar.operaciones;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFPicture;
import java.io.FileInputStream;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import java.io.File;


import com.umg.proyectoanalisis.service.ConsultasBusquedasService;
import com.itextpdf.layout.properties.TextAlignment;



import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@RestController
@RequestMapping("/api/auth")
public class EstadoDeCuentaController {

    @Autowired
    private ConsultasBusquedasService personaService;

    @GetMapping("/obtener-movimiento-cuenta")
    public ResponseEntity<List<Map<String, Object>>> obtenerMovimientoCuenta(
            @RequestParam String valorBusqueda,
            @RequestParam String tipo,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int anio,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int mes) {
        try {
            if (mes < 1 || mes > 12) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            List<Map<String, Object>> movimientos = personaService.buscarMovimientoCuenta(valorBusqueda, tipo, anio, mes);
            if (movimientos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(movimientos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> generarPdf(
            @RequestParam String valorBusqueda,
            @RequestParam String tipo,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int anio,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int mes) {
        try {
            if (mes < 1 || mes > 12) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            List<Map<String, Object>> movimientos = personaService.buscarMovimientoCuenta(valorBusqueda, tipo, anio, mes);
            if (movimientos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            
            String nombreCliente = movimientos.get(0).getOrDefault("NombreCompleto", "N/A").toString();
            String numeroCuenta = movimientos.get(0).getOrDefault("NumeroCuenta", "N/A").toString();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            String logoPath = "src/main/resources/images/logo.png";
            ImageData imageData = ImageDataFactory.create(new File(logoPath).getAbsolutePath());
            Image logo = new Image(imageData);
            logo.scaleToFit(100, 100);
            document.add(logo);

            
            document.add(new Paragraph("Nombre del Cliente: " + nombreCliente)
                    .setFontSize(10));
            document.add(new Paragraph("Número de Cuenta: " + numeroCuenta)
                    .setFontSize(10));
            document.add(new Paragraph("Fecha de Emisión: " + LocalDate.now().toString())
                    .setFontSize(10));
            document.add(new Paragraph("Período: Desde " + anio + "-" + String.format("%02d", mes) + "-01 Hasta " + anio + "-" + String.format("%02d", mes) + "-30")
                    .setFontSize(10));
            document.add(new Paragraph("\n"));

            
            Table table = new Table(new float[]{80, 80, 150, 80, 80, 100});
            table.setWidth(600);
            table.addHeaderCell(new Paragraph("Fecha Movimiento").setBold());
            table.addHeaderCell(new Paragraph("Tipo de Movimiento").setBold());
            table.addHeaderCell(new Paragraph("Descripción").setBold());
            table.addHeaderCell(new Paragraph("Cargo (Q)").setBold());
            table.addHeaderCell(new Paragraph("Abono (Q)").setBold());
            table.addHeaderCell(new Paragraph("Saldo Acumulado (Q)").setBold());

            for (Map<String, Object> movimiento : movimientos) {
                table.addCell(movimiento.getOrDefault("Fecha", "").toString());
                table.addCell(movimiento.getOrDefault("TipoMovimiento", "").toString());
                table.addCell(movimiento.getOrDefault("DocumentoReferencia", "").toString());
                table.addCell(movimiento.getOrDefault("Cargo", "0").toString());
                table.addCell(movimiento.getOrDefault("Abono", "0").toString());
                table.addCell(movimiento.getOrDefault("SaldoAcumulado", "0").toString());
            }
            document.add(table);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Totales")
                    .setBold()
                    .setFontSize(12));
            double totalCargos = movimientos.stream()
                    .mapToDouble(m -> Double.parseDouble(m.getOrDefault("Cargo", "0").toString()))
                    .sum();
            double totalAbonos = movimientos.stream()
                    .mapToDouble(m -> Double.parseDouble(m.getOrDefault("Abono", "0").toString()))
                    .sum();
            double saldoFinal = totalCargos - totalAbonos;
            if (!movimientos.isEmpty()) {
                saldoFinal = Double.parseDouble(movimientos.get(movimientos.size() - 1).getOrDefault("SaldoAcumulado", "0").toString());
            }
            document.add(new Paragraph("Total Cargos (Q): " + String.format("%.2f", totalCargos))
                    .setFontSize(10));
            document.add(new Paragraph("Total Abonos (Q): " + String.format("%.2f", totalAbonos))
                    .setFontSize(10));
            document.add(new Paragraph("Saldo Final (Q): " + String.format("%.2f", saldoFinal))
                    .setFontSize(10));

            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "estado_cuenta_" + numeroCuenta + ".pdf");

            return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/export-excel")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestParam String valorBusqueda,
            @RequestParam String tipo,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int anio,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int mes) {
        try {
            if (mes < 1 || mes > 12) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            List<Map<String, Object>> movimientos = personaService.buscarMovimientoCuenta(valorBusqueda, tipo, anio, mes);
            if (movimientos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            
            String nombreCliente = movimientos.get(0).getOrDefault("NombreCompleto", "N/A").toString();
            String numeroCuenta = movimientos.get(0).getOrDefault("NumeroCuenta", "N/A").toString();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet("Estado de Cuenta");

           
            try {
                String logoPath = "src/main/resources/images/logo.png";
                FileInputStream fis = new FileInputStream(new File(logoPath));
                byte[] bytes = fis.readAllBytes();
                fis.close();
                
                int pictureIdx = workbook.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
                XSSFDrawing drawing = sheet.createDrawingPatriarch();
                XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 0, 0, 0, 0);
                XSSFPicture picture = drawing.createPicture(anchor, pictureIdx);
                picture.resize(0.5); // Ajusta el tamaño según necesites
            } catch (Exception e) {
                System.err.println("Error al cargar el logo: " + e.getMessage());
            }

            LocalDateTime now = LocalDateTime.now(); 
            ZoneId cstZone = ZoneId.of("America/Guatemala");
            ZonedDateTime cstNow = now.atZone(cstZone);

            int startRow = 5;

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            Row headerRow = sheet.createRow(startRow);
            headerRow.createCell(0).setCellValue("Grupo Charlie Bank");
            headerRow.getCell(0).setCellStyle(headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, 0, 5));

            // Usar datos dinámicos
            sheet.createRow(startRow + 1).createCell(0).setCellValue("Nombre del Cliente: " + nombreCliente);
            sheet.createRow(startRow + 2).createCell(0).setCellValue("Número de Cuenta: " + numeroCuenta);
            sheet.createRow(startRow + 3).createCell(0).setCellValue("Fecha de Emisión: " + cstNow.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z")));
            sheet.createRow(startRow + 4).createCell(0).setCellValue("Período: Desde " + anio + "-" + String.format("%02d", mes) + "-01 Hasta " + anio + "-" + String.format("%02d", mes) + "-30");

            Row tableHeaderRow = sheet.createRow(startRow + 6);
            String[] headers = {"Fecha Movimiento", "Tipo de Movimiento", "Descripción", "Cargo (Q)", "Abono (Q)", "Saldo Acumulado (Q)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = tableHeaderRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = startRow + 7;
            for (Map<String, Object> movimiento : movimientos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(movimiento.getOrDefault("Fecha", "").toString());
                row.createCell(1).setCellValue(movimiento.getOrDefault("TipoMovimiento", "").toString());
                row.createCell(2).setCellValue(movimiento.getOrDefault("DocumentoReferencia", "").toString());
                row.createCell(3).setCellValue(Double.parseDouble(movimiento.getOrDefault("Cargo", "0").toString()));
                row.createCell(4).setCellValue(Double.parseDouble(movimiento.getOrDefault("Abono", "0").toString()));
                row.createCell(5).setCellValue(Double.parseDouble(movimiento.getOrDefault("SaldoAcumulado", "0").toString()));
            }

            Row totalsRow = sheet.createRow(rowNum + 1);
            totalsRow.createCell(0).setCellValue("Totales");
            totalsRow.getCell(0).setCellStyle(headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowNum + 1, rowNum + 1, 0, 5));

            double totalCargos = movimientos.stream()
                    .mapToDouble(m -> Double.parseDouble(m.getOrDefault("Cargo", "0").toString()))
                    .sum();
            double totalAbonos = movimientos.stream()
                    .mapToDouble(m -> Double.parseDouble(m.getOrDefault("Abono", "0").toString()))
                    .sum();
            double saldoFinal = !movimientos.isEmpty() ? Double.parseDouble(movimientos.get(movimientos.size() - 1).getOrDefault("SaldoAcumulado", "0").toString()) : 0.0;

            Row totalsDataRow = sheet.createRow(rowNum + 2);
            totalsDataRow.createCell(0).setCellValue("Total Cargos (Q): " + String.format("%.2f", totalCargos));
            totalsDataRow.createCell(1).setCellValue("Total Abonos (Q): " + String.format("%.2f", totalAbonos));
            totalsDataRow.createCell(2).setCellValue("Saldo Final (Q): " + String.format("%.2f", saldoFinal));

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);
            workbook.close();

            HttpHeaders headersN = new HttpHeaders();
            headersN.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headersN.setContentDispositionFormData("attachment", "estado_cuenta_" + numeroCuenta + "_" + cstNow.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx");

            return new ResponseEntity<>(baos.toByteArray(), headersN, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    }