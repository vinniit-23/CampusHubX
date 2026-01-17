import { useState, useEffect } from "react";
import { achievementsApi } from "../../services/api/achievements";
import Card from "../../components/common/Card/Card";
import Spinner from "../../components/common/Spinner/Spinner";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import Badge from "../../components/common/Badge/Badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { achievementSchema } from "../../utils/validators";
import Input from "../../components/common/Input/Input";
import Textarea from "../../components/common/Textarea/Textarea";
import Select from "../../components/common/Select/Select";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/helpers";
import { ACHIEVEMENT_TYPES, VERIFICATION_STATUS } from "../../utils/constants";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(achievementSchema),
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Locate this function
  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await achievementsApi.getAll();
      if (response.success) {
        // 🔴 OLD: setAchievements(response.data || []);
        // 🟢 NEW: Extract the 'data' array
        setAchievements(response.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // 🧼 SANITIZATION STEP
      // Convert empty strings to undefined to satisfy Backend Joi validation
      const cleanData = {
        ...data,
        certificateUrl: data.certificateUrl || undefined,
        evidenceUrl: data.evidenceUrl || undefined, // If you add this field later
        expiryDate: data.expiryDate || undefined,
        // Ensure description is not just whitespace if entered
        description: data.description?.trim() || undefined,
      };

      if (editingAchievement) {
        await achievementsApi.update(editingAchievement._id, cleanData); // Use cleanData
        toast.success("Achievement updated successfully");
      } else {
        await achievementsApi.create(cleanData); // Use cleanData
        toast.success("Achievement created successfully");
      }
      fetchAchievements();
      setModalOpen(false);
      setEditingAchievement(null);
      reset();
    } catch (error) {
      console.error(error);
      // Show the specific error message from the backend
      const errorMessage = error.response?.data?.error?.message;
      const errorDetails = error.response?.data?.error?.details?.[0]?.message;
      toast.error(errorDetails || errorMessage || "Failed to save achievement");
    }
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    reset(achievement);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        await achievementsApi.delete(id);
        toast.success("Achievement deleted successfully");
        fetchAchievements();
      } catch (error) {
        toast.error("Failed to delete achievement");
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === VERIFICATION_STATUS.VERIFIED) {
      return <Badge variant="success">Verified</Badge>;
    }
    if (status === VERIFICATION_STATUS.REJECTED) {
      return <Badge variant="danger">Rejected</Badge>;
    }
    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Achievements</h1>
          <p className="mt-2 text-gray-600">
            Track your certifications and achievements
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Achievement</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement._id} hover>
              <Card.Body>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {achievement.title}
                  </h3>
                  {getStatusBadge(achievement.verificationStatus)}
                </div>
                <p className="text-gray-600 mt-2">{achievement.description}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Type:</span>{" "}
                    {achievement.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Issuer:</span>{" "}
                    {achievement.issuer}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Issued:</span>{" "}
                    {formatDate(achievement.issueDate)}
                  </p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(achievement)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(achievement._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAchievement(null);
          reset();
        }}
        title={editingAchievement ? "Edit Achievement" : "Add Achievement"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            name="title"
            register={register}
            error={errors.title?.message}
            required
          />
          <Textarea
            label="Description"
            name="description"
            register={register}
            error={errors.description?.message}
            rows={3}
          />
          <Select
            label="Type"
            name="type"
            register={register}
            error={errors.type?.message}
            options={Object.values(ACHIEVEMENT_TYPES).map((type) => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1),
            }))}
            required
          />
          <Input
            label="Issuer"
            name="issuer"
            register={register}
            error={errors.issuer?.message}
            required
          />
          <Input
            label="Issue Date"
            type="date"
            name="issueDate"
            register={register}
            error={errors.issueDate?.message}
            required
          />
          <Input
            label="Expiry Date"
            type="date"
            name="expiryDate"
            register={register}
            error={errors.expiryDate?.message}
          />
          <Input
            label="Certificate URL"
            type="url"
            name="certificateUrl"
            register={register}
            error={errors.certificateUrl?.message}
          />
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {editingAchievement ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setEditingAchievement(null);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Achievements;
