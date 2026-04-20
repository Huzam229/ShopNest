import { showToast } from "@/lib/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteMutation = (querykey, deleteEndpoint) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ ids, deleteType }) => {
            console.log(ids, deleteType)
            const res = await fetch(deleteEndpoint, {
                method: deleteType === "PD" ? "DELETE" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids, deleteType }),
            });

            const response = await res.json();
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },

        onSuccess: (data) => {
            showToast("success", data.message || "Deleted successfully");
            queryClient.invalidateQueries({ queryKey: [querykey] });
        },

        onError: (error) => {
            showToast("error", error.message);
        },
    });
};

export default useDeleteMutation;