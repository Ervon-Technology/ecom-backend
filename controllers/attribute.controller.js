const Attribute = require('../models/attribute');

exports.addAttribute = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newAttribute = new Attribute({
            name,
            description
        });

        await newAttribute.save();

        res.status(201).json({ message: 'Attribute added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add attribute' });
    }
};

exports.getAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.find();
        res.json(attributes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attributes' });
    }
};

exports.updateAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedAttribute = await Attribute.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedAttribute) {
            return res.status(404).json({ error: 'Attribute not found' });
        }

        res.json(updatedAttribute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update attribute' });
    }
};

exports.deleteAttribute = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAttribute = await Attribute.findByIdAndDelete(id);

        if (!deletedAttribute) {
            return res.status(404).json({ error: 'Attribute not found' });
        }

        res.json({ message: 'Attribute deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete attribute' });
    }
};

exports.getSingleAttribute = async (req, res) => {
    try {
        const { id } = req.params;

        const attribute = await Attribute.findById(id);

        if (!attribute) {
            return res.status(404).json({ error: 'Attribute not found' });
        }

        res.json(attribute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attribute' });
    }
};