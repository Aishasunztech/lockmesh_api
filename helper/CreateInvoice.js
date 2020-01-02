const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path, type = null) {

    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    if (type === 'editService') {
        generateEditInvoiceTable(doc, invoice, type);
    } else {
        generateInvoiceTable(doc, invoice, type);
    }
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));

}

function generateHeader(doc) {
    doc
        // .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(30)
        .text("MDM PANEL SERVICES", 120, 50)
        .fontSize(10)
        .text("FLAT/RM H 15/F  SIU KING BLDG 6 ON WAH ST", 185, 85)
        .text("NGAU TAU KOK KLN, HONG KONG", 215, 100)
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("INVOICE", 50, 160);

    doc
        .fillColor("#444444")
        .fontSize(20)
        .text(invoice.invoice_status, 400, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            ((invoice.pay_now) ? 0 : (invoice.invoice_status === "UNPAID" ? invoice.paid : (invoice.paid - invoice.paid_credits))) + " Credits",
            150,
            customerInformationTop + 30
        )

        .font("Helvetica")
        .text("Dealer Name:", 325, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 425, customerInformationTop)
        .font("Helvetica")
        .text("Device ID:", 325, customerInformationTop + 15)
        .font("Helvetica-Bold")
        .text(invoice.shipping.device_id, 425, customerInformationTop + 15)
        .font("Helvetica")
        .text("User ID:", 325, customerInformationTop + 30)
        .font("Helvetica-Bold")
        .text(invoice.shipping.user_id, 425, customerInformationTop + 30)
        .font("Helvetica")
        .text("Dealer PIN:", 325, customerInformationTop + 45)
        .font("Helvetica-Bold")
        .text(invoice.shipping.dealer_pin, 425, customerInformationTop + 45)
        .moveDown();

    generateHr(doc, 267);
}

function generateInvoiceTable(doc, invoice, type) {
    let i;
    let invoiceTableTop = 330;
    if (type === 'extend') {
        doc
            .fillColor("#444444")
            .fontSize(15)
            .font("Helvetica-Bold")
            .text("EXTENDED SERVICES", 220, 330);

        invoiceTableTop = 365;
    }
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Term",
        "Unit price (Credits)",
        "Quantity",
        "Total  (Credits)"
    );
    generateHr(doc, invoiceTableTop + 25);
    doc.font("Helvetica");
    let counter = 0

    for (i = 0; i < invoice.hardwares.length; i++) {
        const item = invoice.hardwares[i];
        const position = invoiceTableTop + (counter + 1) * 40;
        counter++
        generateTableRow(
            doc,
            position,
            "Hardware",
            item.hardware_name,
            "---",
            item.hardware_price,
            invoice.quantity,
            item.hardware_price * invoice.quantity
        );
        generateHr(doc, position + 25);
    }

    for (i = 0; i < invoice.packages.length; i++) {
        const item = invoice.packages[i];
        const position = invoiceTableTop + (counter + 1) * 40;
        counter++
        generateTableRow(
            doc,
            position,
            "Package",
            item.pkg_name,
            item.pkg_term,
            item.pkg_price,
            invoice.quantity,
            item.pkg_price * invoice.quantity
        );

        generateHr(doc, position + 25);
    }
    for (i = 0; i < invoice.products.length; i++) {
        const item = invoice.products[i];
        const position = invoiceTableTop + (counter + 1) * 40;
        counter++
        generateTableRow(
            doc,
            position,
            "Product",
            item.price_for,
            item.price_term,
            item.unit_price,
            invoice.quantity,
            item.unit_price * invoice.quantity
        );
        generateHr(doc, position + 25);
    }


    const subtotalPosition = invoiceTableTop + (counter + 1) * 40;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "",
        "Subtotal :",
        "",
        invoice.subtotal + " Credits"
    );
    let discountPricePosition = 0
    if (invoice.pay_now) {
        // const discountPosition = subtotalPosition + 20;
        // generateTableRow(
        //     doc,
        //     discountPosition,
        //     "",
        //     "",
        //     "",
        //     "Discount :",
        //     "",
        //     invoice.discountPercent + " Credits"
        // );
        discountPricePosition = subtotalPosition + 20;
        generateTableRow(
            doc,
            discountPricePosition,
            "",
            "",
            "",
            "Discount Price : ",
            "",
            "-" + invoice.discount + " Credits"
        );
    }
    let paidToDatePosition = 0
    if (invoice.pay_now) {
        paidToDatePosition = discountPricePosition + 20;
    } else {
        paidToDatePosition = subtotalPosition + 20
    }
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "",
        "Paid To Date : ",
        "",
        ((invoice.pay_now) ? invoice.paid : (invoice.invoice_status === "UNPAID" ? 0 : invoice.paid_credits)) + " Credits"
    );

    const duePosition = paidToDatePosition + 15;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "",
        "Balance Due:",
        "",
        ((invoice.pay_now) ? 0 : (invoice.invoice_status === "UNPAID" ? invoice.paid : (invoice.paid - invoice.paid_credits))) + " Credits"
    );

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition + 15,
        "",
        "",
        "",
        "Equivalent USD Price:",
        "",
        "$" + invoice.paid + ".00"
    );
    doc.font("Helvetica");
}

function generateEditInvoiceTable(doc, invoice, type) {
    let invoiceTableTop = 290
    if (invoice.prevService.prevServicePackages.length || invoice.prevService.prevServiceProducts.length) {
        doc
            .fillColor("#444444")
            .fontSize(15)
            .font("Helvetica-Bold")
            .text("CURRENT SERVICES", 220, 290);

        invoiceTableTop = 320;
        doc.font("Helvetica-Bold");
        generateTableRow(
            doc,
            invoiceTableTop,
            "Item",
            "Description",
            "Original Term",
            "Credit Term",
            "Unit Price",
            "Total  (Credits)"
        );
        generateHr(doc, invoiceTableTop + 15);

        doc.font("Helvetica");

        let counter = 0

        const item = invoice.prevService;
        const position = invoiceTableTop + (counter + 1) * 30;
        counter++
        generateTableRow(
            doc,
            position,
            "REFUND",
            "Prev Service Refund",
            "1 Month",
            item.serviceRemainingDays,
            "-" + (invoice.prevService.creditsToRefund / item.serviceRemainingDays).toFixed(2),
            "-" + invoice.prevService.creditsToRefund

        );
        generateHr(doc, position + 15);

        let prevServiceTotal = invoiceTableTop + (counter + 1) * 30
        doc.font("Helvetica-Bold");
        generateTableRow(
            doc,
            prevServiceTotal,
            "",
            "",
            "",
            "TOTAL REFUND :",
            "",
            "-" + invoice.prevService.creditsToRefund + " Credits"
        );


        let newServicesPosition = prevServiceTotal + 20
        doc
            .fillColor("#444444")
            .fontSize(15)
            .font("Helvetica-Bold")
            .text("NEW SERVICES", 227, newServicesPosition + 15);

        invoiceTableTop = newServicesPosition + 40
    }

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Term",
        "Unit price (Credits)",
        "Quantity",
        "Total  (Credits)"
    );
    generateHr(doc, invoiceTableTop + 15);
    doc.font("Helvetica");
    let counter = 0

    for (i = 0; i < invoice.packages.length; i++) {
        const item = invoice.packages[i];
        const position = invoiceTableTop + (counter + 1) * 30;
        counter++
        generateTableRow(
            doc,
            position,
            "Package",
            item.pkg_name,
            item.pkg_term,
            item.pkg_price,
            invoice.quantity,
            item.pkg_price * invoice.quantity
        );
        generateHr(doc, position + 15);
    }

    for (i = 0; i < invoice.products.length; i++) {
        const item = invoice.products[i];
        const position = invoiceTableTop + (counter + 1) * 30;
        counter++
        generateTableRow(
            doc,
            position,
            "Product",
            item.price_for,
            item.price_term,
            item.unit_price,
            invoice.quantity,
            item.unit_price * invoice.quantity
        );

        generateHr(doc, position + 15);
    }


    const subtotalPosition = invoiceTableTop + (counter + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "",
        "Subtotal :",
        "",
        invoice.subtotal + " Credits"
    );
    let discountPricePosition = 0
    if (invoice.pay_now) {
        discountPricePosition = subtotalPosition + 20;
        generateTableRow(
            doc,
            discountPricePosition,
            "",
            "",
            "",
            "Discount: ",
            "",
            "-" + invoice.discount + " Credits"
        );
    }
    let refundPricePosition = 0
    if (invoice.pay_now) {
        refundPricePosition = discountPricePosition + 20;
    }
    else {
        refundPricePosition = subtotalPosition + 20
    }
    generateTableRow(
        doc,
        refundPricePosition,
        "",
        "",
        "",
        "REFUND : ",
        "",
        "-" + invoice.prevService.creditsToRefund + " Credits"
    );

    let paidToDatePosition = 0
    if (invoice.pay_now) {
        paidToDatePosition = refundPricePosition + 20;
    } else {
        paidToDatePosition = refundPricePosition + 20;
    }
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "",
        "TOTAL : ",
        "",
        invoice.paid + " Credits"
    );

    const duePosition = paidToDatePosition + 15;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "",
        "Paid to date:",
        "",
        ((invoice.pay_now) ? invoice.paid : (invoice.invoice_status === "UNPAID" ? 0 : invoice.paid_credits)) + " Credits"
    );
    const duePosition1 = duePosition + 15;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition1,
        "",
        "",
        "",
        "Balance Due:",
        "",
        ((invoice.pay_now) ? 0 : (invoice.invoice_status === "UNPAID" ? invoice.paid : (invoice.paid - invoice.paid_credits))) + " Credits"
    );
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition1 + 15,
        "",
        "",
        "",
        "Equivalent USD Price:",
        "",
        "$" + invoice.paid + ".00"
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    term,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 100, y, { width: 150, align: "center" })
        .text(term, 250, y)
        .text(unitCost, 300, y, { width: 115, align: "right" })
        .text(quantity, 400, y, { width: 65, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = {
    createInvoice
};