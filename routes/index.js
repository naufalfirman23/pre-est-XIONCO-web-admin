const express = require('express');
const router = express.Router();
const db = require('../db');

// Halaman utama: daftar pembelian
router.get('/', (req, res) => {
    db.query(`SELECT pembelian.*, produk.nama FROM pembelian 
              JOIN produk ON pembelian.produk_id = produk.id`, 
              (err, results) => {
        if (err) throw err;
        res.render('index', { pembelian: results });
    });
});

// Form input pembelian
router.get('/pembelian', (req, res) => {
    db.query('SELECT * FROM produk', (err, products) => {
        if (err) throw err;
        res.render('pembelian', { produk: products });
    });
});

router.post('/pembelian', (req, res) => {
    const { produk_id, jumlah } = req.body;
    db.query('SELECT * FROM produk WHERE id = ?', [produk_id], (err, product) => {
        if (err) throw err;
        var total = product[0].harga * jumlah;
            db.query('INSERT INTO pembelian (produk_id, jumlah, total_beli) VALUES (?, ?, ?)', 
             [produk_id, jumlah, total], 
             (err) => {
        if (err) throw err;
        res.redirect('/');
    });
    });

});

// Cancel pembelian
router.post('/cancel/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE pembelian SET status = "dibatalkan" WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

module.exports = router;
