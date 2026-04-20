# FlowForge — HR Workflow Designer

A production-grade HR Workflow Designer built for the Tredence Studio Full Stack Engineering Intern case study. Build, configure, and simulate internal HR workflows visually using a drag-and-drop canvas.

https://www.loom.com/share/1363af7f399146ba96b826d6de4035b2

---

## Running the Project

### Prerequisites
- Node.js v18+
- npm v9+

### Steps

```bash
# 1. Unzip and enter the project
cd hr-workflow-designer

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Open http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## Architecture

<img width="1376" height="768" alt="Img" src="https://github.com/user-attachments/assets/b584a406-295d-4cd5-9431-f6b2423b0448" />

```
src/
├── types/
│   └── workflow.ts           # TypeScript interfaces — WorkflowNodeData union type
├── store/
│   └── workflowStore.ts      # Zustand global state — nodes, edges, history, sim
├── api/
│   └── mockApi.ts            # Mock API (GET /automations, POST /simulate)
├── hooks/
│   └── useWorkflow.ts        # useAutomations, useSimulation, useKeyboardShortcuts
└── components/
    ├── nodes/
    │   ├── BaseNode.tsx       # Shared node shell — handles, header, delete
    │   └── NodeTypes.tsx      # StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode
    ├── forms/
    │   └── NodeForms.tsx      # Per-node config forms (dynamic, controlled, typed)
    ├── ui/
    │   ├── FormControls.tsx   # Input, TextArea, Select, NumberInput, Toggle
    │   └── KeyValueEditor.tsx # Dynamic key-value pair editor
    └── panels/
        ├── Toolbar.tsx        # Top bar — undo/redo, export/import, clear, run
        ├── NodeSidebar.tsx    # Left panel — draggable node palette
        ├── WorkflowCanvas.tsx # React Flow canvas with DnD, snap grid, minimap
        ├── ConfigPanel.tsx    # Right slide-in panel — node editing forms
        └── SandboxPanel.tsx   # Floating simulation panel — execution log
```

---

## Implemented Features

### Canvas (React Flow)
- Drag and drop nodes from sidebar onto canvas
- Connect nodes with animated edges
- Select node to open config panel
- Delete nodes/edges (Delete key or trash button)
- Snap to grid (16px)
- MiniMap with per-type node colors
- Zoom controls
- Drop indicator overlay when dragging

### Node Types

| Node | Color | Purpose |
|------|-------|---------|
| Start | Green | Workflow entry point |
| Task | Blue | Human task with assignee, due date, custom fields |
| Approval | Purple | Role-based approval with auto-approve threshold |
| Automated | Orange | System actions from mock API (dynamic params) |
| End | Red | Workflow completion with summary toggle |

### Node Configuration Forms
- Dynamic forms per node type, fully controlled
- Key-value metadata editor (Start, Task nodes)
- Dynamic action parameter fields (Automated — driven by API response)
- Type-safe updates via Zustand
- Slide-in animation on selection

### Mock API Layer
- GET /automations — 7 mock actions with param schemas
- POST /simulate — real BFS graph traversal with per-node validation
- Simulated network delay

### Simulation Sandbox
- Serializes the full workflow graph
- BFS execution traversal with timestamps
- Validates: missing start/end, disconnected nodes, cycle detection (DFS)
- Per-node status: success / warning / error
- Timestamped execution log with summary banner
- Floating panel with Re-run capability

### Bonus Features
- Export/Import workflow as JSON (download/upload)
- Undo/Redo — full history stack (50 deep), Ctrl+Z / Ctrl+Y
- Keyboard shortcuts — Delete to remove selected node
- MiniMap color-coded by node type
- Live node/edge count in toolbar

---

## Design Decisions

**Zustand over Redux** — minimal boilerplate, direct selector pattern, store owns the undo/redo stack.

**Discriminated union type system** — `WorkflowNodeData = StartNodeData | TaskNodeData | ...` with `type` as discriminant. All interfaces extend `Record<string, unknown>` to satisfy React Flow's generic while retaining full application-level type safety.

**BaseNode pattern** — single shell used by all 5 node types, handles selection, delete, handles, and header. Node-specific rendering is just the content slot.

**useNodeData generic hook** — `useNodeData<T>(nodeId)` returns typed data + update function without prop drilling. Adding a new node type is just: write a form using this hook.

**API boundary isolation** — `api` object in `mockApi.ts` is the sole API surface. Replacing mocks with real HTTP requires zero component changes.

**Real graph simulation** — BFS traversal with actual cycle detection via DFS recursion stack. Not fabricated step data.

---

## What I Would Add With More Time

1. Conditional edge branching (if approved then X, else Y)
2. Auto-layout with Dagre for messy graphs
3. Visual validation — red rings on invalid nodes on canvas
4. Real FastAPI + PostgreSQL backend for persistence
5. Node version history with diff view
6. Workflow deployment and rollback versioning
7. Bottleneck analytics — avg step duration, flagging slow approval nodes

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Canvas | @xyflow/react (React Flow v12) |
| State | Zustand |
| Styling | CSS Variables + Tailwind v4 |
| Icons | Lucide React |
| Fonts | Syne + DM Mono |
| Mock API | Local module (MSW-ready interface) |
