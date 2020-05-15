import React, { useState, useEffect } from 'react';
import { ReceiptRow, ReceiptRowType } from '../items/ReceiptRow';

export function ReceiptPage() {

    const [items, setItems] = useState([]);

    function getUidForView() {
        return "view" + performance.now() + Math.random();
    }

/*
    public class ReceiptDatumWithUid
        public int Uid { get; set; }
    public class ReceiptDatum
        public string Id { get; set; }
        public string Payee { get; set; }
        public DateTime Date { get; set; }
        public List<ReceiptItemDatum> Items { get; set; }

    public class ReceiptItemDatum
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Number { get; set; }

 */
    function getDate() {

        fetch('ReceiptInfo')
            .then(response => response.json())
            .then(result => {

                for (let datum of result) {

                    datum.uidForView = getUidForView();

                    for (let item of datum.items) {
                        item.uidForView = getUidForView();
                    }
                }
                setItems(result);
                console.log(result);
            });
    };

    useEffect(() => {
        getDate();
    }, []);

    return (
        <div>
            {items.map((item, index) => (
                <ReceiptRow key={item.uid} inputData={item} initRowType={ReceiptRowType.View} getUidForView={getUidForView} refreshTrigger={getDate}></ReceiptRow>
            ))}
        </div>
    );
}
