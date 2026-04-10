const Supply = require('../Models/Supply');

exports.getAllSupplies = async (req, res) => {
    try {
        const supplies = await Supply.find().sort({ createdAt: -1 });
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createSupply = async (req, res) => {
    try {
        const supply = new Supply(req.body);
        await supply.save();
        res.status(201).json(supply);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.updateSupply = async (req, res) => {
    try {
        const { id } = req.params;
        const supply = await Supply.findByIdAndUpdate(id, req.body, { new: true });
        if (!supply) return res.status(404).json({ msg: 'Supply not found' });
        res.json(supply);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteSupply = async (req, res) => {
    try {
        const { id } = req.params;
        const supply = await Supply.findByIdAndDelete(id);
        if (!supply) return res.status(404).json({ msg: 'Supply not found' });
        res.json({ msg: 'Supply deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
