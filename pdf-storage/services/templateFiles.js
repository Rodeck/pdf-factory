import { fetchTemplates } from "./dbStorage.js";

const getTemplates = async (userId) => {
    return await fetchTemplates(userId);
}

export default getTemplates;