import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';

import { CounterService } from './counter.service';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {

    /** Table Object */
    // @Input() table: any;

    // dummy data for input table
    public table = {
        id: 1,
        table_number: 2

    };

    // dummy data for order
    public order = [
        {
            name: 'Chicken Soup',
            quantity: 1,
            price: 7
        },
        {
            name: 'Curry',
            quantity: 2,
            price: 11.99
        },
    ];

    public totalNoDiscount: number;

    public totalWithDiscount: number;

    public discountForm: FormGroup;

    public dicountedValue: number;

    public showView = true;

    /**
     * Counter Comoponent Constructor
     *
     * @param counterService Counter Service
     * @param formBuilder Form Builder
     */
    constructor(
        protected counterService: CounterService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {
        this.createForm();
        this.calculateTotal();

        this.dicountedValue = 0;
    }

    /**
    * Creates the form
    */
    createForm(): void {
        this.discountForm = this.formBuilder.group({
            discount: this.formBuilder.control(0, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(3),
            ])
        });
    }

    /**
     * Calculate the total of all prices. Item price * quantity
     */
    calculateTotal() {
        const prices = [];
        this.order.forEach(element => {
            prices.push(element.price * element.quantity);
        });

        this.totalNoDiscount = prices.reduce((accumulator, currentValue) => accumulator + currentValue);
    }

    /**
     * Calculate  the discount out of the total price
     */
    addPromo() {
        const discountValue = this.discountForm.controls.discount.value;
        this.dicountedValue = (discountValue / 100) * this.totalNoDiscount;

        this.totalWithDiscount = (this.totalNoDiscount - this.dicountedValue);
    }

    /**
     * Show or Hide Order panel
     * @param boolean Value
     */
    show(val: boolean) {
        this.showView = val;
    }

    completeOrder() {
        // TO DO: change table status from busy to available again.
        // Change order status to done
    }

    /**
     * Creates the receipts and downloads it
     */
    printReceipt() {

        const date = new Date();

        const text = [];
        const lineHeight = 1.2,
            margin = 0.1,
            fontSize = 9,
            ptsPerInch = 72,
            oneLineHeight = fontSize * lineHeight / ptsPerInch,
            doc = new jsPDF({
                unit: 'in',
                lineHeight: lineHeight,
                format: 'credit-card'
            }).setProperties({ title: 'Receipt' });

        this.order.forEach(element => {
            const itemPrice = element.price * element.quantity;
            const item = '£' + itemPrice.toFixed(2) + ' x ' + element.quantity + ' - ' + element.name + '\n';
            text.push(item.toString());
        });

        doc
            .setFont('helvetica', 'neue')
            .setFontSize(fontSize);

        // doc.text can now add those lines easily; otherwise, it would have run text off the screen!
        doc.text(text, margin, margin + 4 * oneLineHeight);

        // You can also calculate the height of the text very simply:
        const textHeight = text.length * fontSize * lineHeight / ptsPerInch;
        doc.setFontStyle('bold')
            .text('Table ' + this.table.table_number + ' Receipt', 1, margin + oneLineHeight, 'center');

        if (this.totalWithDiscount) {
            doc.setFontStyle('normal')
                .text('Discount: £' + this.dicountedValue.toFixed(2), 0.9, textHeight + 0.8, 'right');
            doc.setFontStyle('bold')
                .text('Total: £' + this.totalNoDiscount.toFixed(2), 0.8, textHeight + 1, 'right');
        } else {
            doc.setFontStyle('bold')
                .text('Total: £' + this.totalWithDiscount.toFixed(2), 0.8, textHeight + 1, 'right');
        }

        // Show total
        doc.setFontStyle('bold')
            .text('Thank you for choosing us.', 1, textHeight + 1.5, 'center');
        doc.setFontStyle('normal')
            .text('VAT No: 132323 2323 2', 1, textHeight + 1.8, 'center');
        // Show date
        doc.setFontStyle('italic')
            .text(date.toLocaleDateString(), 1, textHeight + 2, 'center');
        // Receipt Id
        doc.setFontStyle('normal')
            .text('32322123', 1, textHeight + 2.15, 'center');

        doc.save('receipt.pdf');
    }

}
