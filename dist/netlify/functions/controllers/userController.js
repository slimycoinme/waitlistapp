const { admin } = require('../config/firebase');
const User = require('../models/user');

const db = admin.firestore();
const usersCollection = 'users';

exports.createUser = async (req, res) => {
  try {
    const userData = new User(req.body);
    const docRef = await db.collection(usersCollection).add(userData.toFirestore());
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection(usersCollection).get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const doc = await db.collection(usersCollection).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userData = new User(req.body);
    await db.collection(usersCollection).doc(req.params.id).update(userData.toFirestore());
    res.status(200).json({ id: req.params.id, ...userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.collection(usersCollection).doc(req.params.id).delete();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 