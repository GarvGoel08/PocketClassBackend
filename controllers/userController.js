const { db } = require("../firebaseConn");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { Name, Role, Email, Phone, Subjects, Password } = req.body;

  try {
    const userSnapshot = await db
      .collection("users")
      .where("Email", "==", Email)
      .get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = {
      Name,
      Role,
      Email,
      Phone,
      Subjects,
      Password: hashedPassword,
      ProfilePhoto:
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    };
    const userRef = await db.collection("users").add(newUser);

    res
      .status(201)
      .json({
        message: "User created successfully",
        userId: userRef.id,
        userRole: Role,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

exports.signin = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const userSnapshot = await db
      .collection("users")
      .where("Email", "==", Email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;

    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      message: "User signed in successfully",
      userId: userId,
      userRole: user.Role,
    });
  } catch (err) {
    res.status(500).json({ message: "Error signing in", error: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userSnapshot = await db.collection("users").doc(userId).get();
    if (!userSnapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userSnapshot.data());
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

exports.getInstructors = async (req, res) => {
  const { subjectFilter } = req.query;

  try {
    let instructorsQuery = db
      .collection("users")
      .where("Role", "==", "Instructor");
    if (subjectFilter) {
      instructorsQuery = instructorsQuery.where(
        "Subjects",
        "array-contains",
        subjectFilter
      );
    }
    const instructorsSnapshot = await instructorsQuery.get();

    if (instructorsSnapshot.empty) {
      return res.status(404).json({ message: "No instructors found" });
    }

    const instructors = instructorsSnapshot.docs.map((doc) => ({
      InstructorID: doc.id,
      ...doc.data()
    }));
    res.json(instructors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching instructors", error: err.message });
  }
};