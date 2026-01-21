import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EditBlog = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    return () => {
      second;
    };
  }, []);

  return <div>EditBlog</div>;
};

export default EditBlog;
