import { useState } from "react";

export default function TaxInvoice() {
  const [preview, setPreview] = useState(false);

  const [form, setForm] = useState({
    companyName: "BIP FENCING CONTRACT WORK",
    address:
      "NO. 26/A, MAIN ROAD, PAMBANKULAM, KALANTHAPANAI, PANAGUDI - 627109",
    gst: "33ABLPI5244C1Z1",
    state: "Tamil Nadu (Code: 33)",

    invoiceNo: "",
    date: "",
    dispatch: "",
    lrNo: "",
    vehicle: "",

    consignee: "",
    buyer: "",

    items: [
      {
        description: "",
        hsn: "",
        qty: "",
        rateIncl: "",
        rateExcl: "",
        per: "NOS",
      },
    ],

    cgst: 9,
    sgst: 9,
    roundOff: 0,

    openBalance: "",
    closingBalance: "",

    bankName: "",
    accountName: "",
    accountNo: "",
    ifsc: "",

    declaration:
      "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleItemChange = (i, field, value) => {
    const items = [...form.items];
    items[i][field] = value;
    setForm({ ...form, items });
  };

  const addItem = () =>
    setForm({
      ...form,
      items: [
        ...form.items,
        { description: "", hsn: "", qty: "", rateIncl: "", rateExcl: "", per: "NOS" },
      ],
    });

  const removeItem = (i) =>
    setForm({
      ...form,
      items: form.items.filter((_, idx) => idx !== i),
    });

  const subtotal = form.items.reduce(
    (sum, item) => sum + item.qty * item.rateExcl,
    0
  );

  const cgstAmt = (subtotal * form.cgst) / 100;
  const sgstAmt = (subtotal * form.sgst) / 100;
  const taxTotal = cgstAmt + sgstAmt;
  const total = subtotal + taxTotal + Number(form.roundOff);

  // Amount in words (simple version)
  const toWords = (num) => {
    return "INR " + num.toFixed(0) + " Only";
  };

  return (
    <>
      {/* ================= FORM ================= */}
      {!preview && (
        <form className="container mt-3" onSubmit={(e) => { e.preventDefault(); setPreview(true); }}>
          <h4>Invoice Entry</h4>

          <input className="form-control mb-2" name="invoiceNo" placeholder="Invoice No" onChange={handleChange} />
          <input type="date" className="form-control mb-2" name="date" onChange={handleChange} />
          <input className="form-control mb-2" name="vehicle" placeholder="Vehicle" onChange={handleChange} />
          <textarea className="form-control mb-2" name="buyer" placeholder="Buyer" onChange={handleChange} />
          <textarea className="form-control mb-2" name="consignee" placeholder="Consignee" onChange={handleChange} />

          <h5>Items</h5>

          {form.items.map((item, i) => (
            <div className="row mb-2" key={i}>
              <div className="col"><input placeholder="Desc" className="form-control" onChange={(e)=>handleItemChange(i,"description",e.target.value)} /></div>
              <div className="col"><input placeholder="HSN" className="form-control" onChange={(e)=>handleItemChange(i,"hsn",e.target.value)} /></div>
              <div className="col"><input placeholder="Qty" className="form-control" onChange={(e)=>handleItemChange(i,"qty",Number(e.target.value))} /></div>
              <div className="col"><input placeholder="Rate Excl" className="form-control" onChange={(e)=>handleItemChange(i,"rateExcl",Number(e.target.value))} /></div>
              <div className="col"><button type="button" className="btn btn-danger" onClick={()=>removeItem(i)}>X</button></div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addItem}>Add Item</button>

          <br /><br />
          <button className="btn btn-primary">Preview</button>
        </form>
      )}

      {/* ================= INVOICE ================= */}
      {preview && (
        <div className="invoice" id="invoice">

          <div className="header text-center">
            <h3>{form.companyName}</h3>
            <p>{form.address}</p>
            <p>GSTIN: {form.gst} | {form.state}</p>
            <h5>TAX INVOICE</h5>
          </div>

          <div className="section">
            <div>
              <b>Buyer:</b><br />{form.buyer}
              <br /><br />
              <b>Consignee:</b><br />{form.consignee}
            </div>

            <div>
              <p>Invoice: {form.invoiceNo}</p>
              <p>Date: {form.date}</p>
              <p>Vehicle: {form.vehicle}</p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Description</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.description}</td>
                  <td>{item.hsn}</td>
                  <td>{item.qty}</td>
                  <td>{item.rateExcl}</td>
                  <td>{item.qty * item.rateExcl}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TAX SECTION */}
          <div className="tax-box">
            <p>Taxable Value: ₹ {subtotal.toFixed(2)}</p>
            <p>CGST ({form.cgst}%): ₹ {cgstAmt.toFixed(2)}</p>
            <p>SGST ({form.sgst}%): ₹ {sgstAmt.toFixed(2)}</p>
            <p>Rounding Off: ₹ {form.roundOff}</p>
            <h5>Grand Total: ₹ {total.toFixed(2)}</h5>
          </div>

          {/* TAX TABLE */}
          <table className="invoice-table mt-3">
            <thead>
              <tr>
                <th>HSN/SAC</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Total Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{form.items[0]?.hsn}</td>
                <td>{subtotal.toFixed(2)}</td>
                <td>{cgstAmt.toFixed(2)}</td>
                <td>{sgstAmt.toFixed(2)}</td>
                <td>{taxTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <p><b>Amount in Words:</b> {toWords(total)}</p>
          <p><b>Tax Amount in Words:</b> {toWords(taxTotal)}</p>

          <p>Open Balance: {form.openBalance}</p>
          <p>Closing Balance: {form.closingBalance}</p>

          <div className="footer">
            <p>{form.declaration}</p>

            <div className="sign">
              <span>Receiver Signature</span>
              <span>Authorised Signatory</span>
            </div>
          </div>

          <div className="no-print mt-3">
            <button className="btn btn-secondary" onClick={() => setPreview(false)}>Edit</button>
            <button className="btn btn-success ms-2" onClick={() => window.print()}>
              Print
            </button>
          </div>
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
        .invoice {
          width: 800px;
          margin: auto;
          padding: 20px;
          border: 1px solid #000;
          font-size: 13px;
        }

        .header { text-align: center; }

        .section {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .invoice-table th, .invoice-table td {
          border: 1px solid #000;
          padding: 5px;
          text-align: center;
        }

        .tax-box {
          text-align: right;
          margin-top: 10px;
        }

        .footer {
          margin-top: 20px;
        }

        .sign {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }

        @media print {
          body * { visibility: hidden; }
          #invoice, #invoice * { visibility: visible; }
          #invoice { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none; }
        }
      `}</style>
    </>
  );
}