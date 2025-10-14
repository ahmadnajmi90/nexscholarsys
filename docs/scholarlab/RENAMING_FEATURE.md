# Inline Editing Feature for Renaming Titles

> **Note on Naming Convention**: This document refers to "ScholarLab" in file paths and technical implementation details. The user-facing brand name for this feature is **NexLab**. See [NAMING_CONVENTIONS.md](../NAMING_CONVENTIONS.md) for more information about the distinction between internal code names (ScholarLab/ProjectHub) and the user-facing brand name (NexLab).

## **Feature Overview**

The inline editing feature allows users to easily rename workspaces, projects, boards, and lists without navigating away from the page. The feature will be integrated with **permissions** to ensure that only authorized users can rename entities. Changes will be broadcasted in **real-time** to all connected users.

---

## **Design & User Experience**

### **Inline Editing on Titles**

* **Workspace/Project/Board Titles:**

  * The titles will be **editable inline** when clicked. A **text cursor** or **pencil icon** will appear on hover to indicate the title is editable.
  * Once clicked, the title will become a **text input field** for editing.
  * **Save** the change when the user clicks out of the field (blur) or presses the **Save button**.
  * **Cancel Action**: Pressing **ESC** or clicking outside the input will **discard changes**.

* **Kanban List Titles:**

  * Each list's title will have **inline editing** on click, allowing the user to update the list name.
  * The editing interface will be the same as for workspaces, projects, and boards.

---

## **Permissions & Access Control**

* **Owner/Admin:**

  * Can rename **all entities**: workspace, project, board, and list.
* **Member:**

  * Cannot rename **any entity** (workspace, project, board, or list).
* **Role-based Access:**

  * Inline editing features (text cursor or pencil icon) will only be visible to users with appropriate permissions.
  * Members will see **static text** and will not have the ability to edit.

---

## **Real-Time Updates**

* **WebSocket Event**: After renaming any entity (workspace, project, board, or list), the name change will be **broadcasted in real-time** to all connected users via **WebSockets**.
* This ensures all users in the workspace/project/board receive the updated name immediately.

---

## **UI/UX Design**

### **General UI Layout**

* **Workspace/Project/Board Titles**:

  * Located at the **top of the page** as static text initially.
  * On hover, a **pencil icon** will appear, and clicking on it will allow inline editing.
* **Kanban List Titles**:

  * Each list will have a **title** displayed at the top of the list.
  * The title will become **editable** when clicked.

### **Save and Cancel Options**

* **Save Button**: Either show a **Save** button that users click to confirm changes or **auto-save** when users click out of the text field (blur).
* **Cancel Action**: Users can press **ESC** or click outside the input field to **cancel** the changes.

---

## **Implementation Plan**

### **Frontend**

1. **Workspace/Project/Board Titles**:

   * Implement inline editing for the title of workspaces, projects, and boards.
   * On hover, show a **pencil icon** or text cursor indicating the title is editable.
   * Allow users to edit the title directly and save or cancel the change.

2. **Kanban List Titles**:

   * Implement inline editing for list titles in the Kanban view. This will allow users to change the name of a list in the same way as the workspace, project, and board titles.

### **Backend**

1. **Controllers**:

   * Modify the following controllers to handle the renaming functionality:

     * `WorkspaceController`
     * `ProjectController`
     * `BoardController`
     * `TaskController`

2. **Permission Check**:

   * Use **Bouncer** or **Policies** to ensure only **Owners** and **Admins** can rename workspaces, projects, boards, and lists. Members will not have permission to edit titles.

3. **Real-Time Broadcasting**:

   * Use **Reverb** (WebSockets) to broadcast the name change event to all connected users.
   * Create events like `WorkspaceUpdated`, `BoardUpdated`, and `TaskUpdated` to notify others of the change.

### **Testing Considerations**

* **Frontend**: Test inline editing UI elements (pencil icon, editable text field, save/cancel actions).
* **Backend**: Ensure that **permissions** are respected (only owners/admins can edit titles). Test API responses and broadcasting of changes to connected users.

---

## **Next Steps**

* **Frontend Development**: Implement the inline editing UI for workspaces, projects, boards, and lists.
* **Backend Development**: Modify the necessary controllers and policies to handle permissions and broadcasting of title changes.
* **Real-Time Integration**: Implement real-time updates using **WebSockets**.
* **Testing**: Test the feature in both frontend and backend contexts to ensure proper behavior and permissions.

