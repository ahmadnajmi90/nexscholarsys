import { usePage } from '@inertiajs/react';

const useRoles = () => {
    const { props } = usePage();
    return {
        isAdmin: props.isAdmin || false,
        isPostgraduate: props.isPostgraduate || false,
        isUndergraduate: props.isUndergraduate || false,
        isFacultyAdmin: props.isFacultyAdmin || false,
        isAcademician: props.isAcademician || false,
        isIndustry: props.isIndustry || false,
        canPostGrants: props.canPostGrants || false,
        canPostEvents: props.canPostEvents || false,
        canPostProjects: props.canPostProjects || false,
        canCreatePosts: props.canCreatePosts || false,
        canCreateFacultyAdmin: props.canCreateFacultyAdmin || false,
        canAssignAbilities: props.canAssignAbilities || false,
    };
};

export default useRoles;
