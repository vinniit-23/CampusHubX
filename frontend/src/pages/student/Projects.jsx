import { useState, useEffect } from "react";
import { projectsApi } from "../../services/api/projects";
import Card from "../../components/common/Card/Card";
import Spinner from "../../components/common/Spinner/Spinner";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import Badge from "../../components/common/Badge/Badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../utils/validators";
import Input from "../../components/common/Input/Input";
import Textarea from "../../components/common/Textarea/Textarea";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/helpers";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  // Locate this function
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsApi.getAll();
      if (response.success) {
        // 🔴 OLD: setProjects(response.data || []);
        // 🟢 NEW: Extract the 'data' array
        setProjects(response.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // 🛠️ FIX: Create a clean object by removing empty strings
      // This prevents sending "" to the backend which triggers the 422 Joi validation error
      const cleanData = {
        ...data,
        githubUrl: data.githubUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        // If you add date inputs later, handle them here too:
        // startDate: data.startDate || undefined,
        // endDate: data.endDate || undefined,
      };

      if (editingProject) {
        await projectsApi.update(editingProject._id, cleanData); // Use cleanData
        toast.success("Project updated successfully");
      } else {
        await projectsApi.create(cleanData); // Use cleanData
        toast.success("Project created successfully");
      }
      fetchProjects();
      setModalOpen(false);
      setEditingProject(null);
      reset();
    } catch (error) {
      console.error(error); // Helpful to see the exact backend error details
      toast.error(
        error.response?.data?.error?.message || "Failed to save project"
      );
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    reset(project);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsApi.delete(id);
        toast.success("Project deleted successfully");
        fetchProjects();
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-2 text-gray-600">Showcase your projects and work</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Project</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} hover>
              <Card.Body>
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="primary" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {formatDate(project.startDate)} -{" "}
                    {formatDate(project.endDate) || "Present"}
                  </span>
                  {project.verifiedBy && (
                    <Badge variant="success" size="sm">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(project._id)}
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
          setEditingProject(null);
          reset();
        }}
        title={editingProject ? "Edit Project" : "Add Project"}
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
            required
            rows={4}
          />
          <Input
            label="GitHub URL"
            type="url"
            name="githubUrl"
            register={register}
            error={errors.githubUrl?.message}
          />
          <Input
            label="Live URL"
            type="url"
            name="liveUrl"
            register={register}
            error={errors.liveUrl?.message}
          />
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {editingProject ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setEditingProject(null);
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

export default Projects;
