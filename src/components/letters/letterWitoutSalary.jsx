import React, { useState, useEffect } from "react";

export const GetLetter = ({ props})=>{
    const {rnc, sello, companyName, address,phones, email,  companyLogo,header_date, employee_id_card,employee_name, hiring_date, date, prefix, position_name, responsable_name, responsable_position, urlImageSigned} = props;

   return (
        `<html><body><section>
            <div class="container">
                <p style="margin-bottom: 0in; line-height: 100%; text-align: left;">
                    <img src="${companyLogo}" class="img-fluid" style="width: 200px !important;min-width: 200px;min-height: 45px;margin-top: 20px;" name="Logo DC" align="bottom" width="200" height="45" border="0" /> <font color="#575757"><font face="Segoe UI, serif"><font size="2" style="font-size: 10pt"><br /><br /><br /></font></font></font><br />
                </p>
                <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif"><font size="3">${header_date}</font></font></p>
                <p style="margin-bottom: 0in; line-height: 100%"><font face="Times New Roman, serif"><font size="3"><br /><br /></font></font><br /></p>
                <p align="center" style="margin-bottom: 0.21in; line-height: 100%; font-weight: bold;"><font face="Times New Roman, serif"><font size="3"><strong>A QUIEN PUEDA INTERESAR</strong></font></font></p>
                <p style="margin-bottom: 0in; line-height: 100%"><font face="Times New Roman, serif"><font size="3"><br /></font></font><br /></p>
                <p align="justify" style="margin-bottom: 0.25in; line-height: 100%"><font face="Times New Roman, serif"><font size="3">Mediante
                la presente, les informamos que el ${prefix}&nbsp;</font></font><font face="Times New Roman, serif"><font size="3"><strong style="font-weight: bold;">${employee_name}</strong></font></font><font face="Times New Roman, serif"><font size="3">,
                dominicano, mayor de edad, portador de la cédula de identidad y
                electoral No.</font></font><font face="Times New Roman, serif"><font size="3"><strong style="font-weight: bold;">${employee_id_card}</strong></font></font><font face="Times New Roman, serif"><font size="3">,
                labora en esta empresa desde ${hiring_date}, desempeñando actualmente el puesto de&nbsp;</font></font>
                <font face="Times New Roman, serif"><font size="3"><strong style="font-weight: bold;">${position_name}</strong></font></font><font face="Times New Roman, serif"><font size="3">,
                ubicada en la ${address}</font></font></p>
                <p align="justify" style="margin-bottom: 0.25in; line-height: 100%"><font face="Times New Roman, serif"><font size="3">Expedimos la presente a solicitud de la parte interesada a los ${date}.</font></font></p>
                <p style="margin-bottom: 0in; line-height: 100%"><font face="Times New Roman, serif"><font size="3"><br /><br /></font></font><br /></p>
                <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif"><font size="3">Atentamente,</font></font></p>
                <p style="margin-bottom: 0in; line-height: 100%"><font face="Times New Roman, serif"><font size="3"><br /></font></font></p>
                <img align="bottom" border="0" height="45" name="Picture 1" src="${urlImageSigned}" style="width: 200px !important;min-width: 200px;min-height: 45px;margin-top: 10px;  text-align: left;" width="200" />
                <img align="bottom" name="Picture 1" src="../../images/sello_gyg.png" ${sello} style="min-width: 150px; min-height: 45px; margin-top: 10px; width: 250px; border-width: 0px; border-style: solid; height: 100px; text-align: left;"/>
                
                <p style="margin-bottom: 0.25in; line-height: 100%; text-align: left;"><font face="Times New Roman, serif"><font size="3"><strong style="font-weight: bold;">${responsable_name}</strong></font></font><font face="Times New Roman, serif"><font size="3"><br />${responsable_position}</font></font></p>
                <p align="center" style="margin-bottom: 0in; line-height: 100%"><font face="Times New Roman, serif"><font size="3"><br /><br /></font></font><br /></p>
                <p align="center" style="margin-bottom: 0in; line-height: 100%"><font face="Times New Roman, serif"><font size="3"><br /><br /><br /></font>
                </font><font face="Times New Roman, serif"><font size="2" style="font-size: 9pt">
                ${companyName} | ${address}<br />${email}
                | ${phones} ${rnc}</font></font></p>
                <p align="center" style="margin-bottom: 0in; line-height: 100%"><br /></p>
            </div>	
        </section></body></html>`
    );
}
