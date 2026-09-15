const {
  isValidTransition,
} = require("../src/services/taskService");

describe("Task workflow", () => {
  test(
    "NOT_STARTED should move to IN_PROGRESS",
    () => {
      expect(
        isValidTransition(
          "NOT_STARTED",
          "IN_PROGRESS"
        )
      ).toBe(true);
    }
  );

  test(
    "IN_PROGRESS should move to WAITING_FOR_CLIENT",
    () => {
      expect(
        isValidTransition(
          "IN_PROGRESS",
          "WAITING_FOR_CLIENT"
        )
      ).toBe(true);
    }
  );

  test(
    "READY_FOR_REVIEW should move to COMPLETED",
    () => {
      expect(
        isValidTransition(
          "READY_FOR_REVIEW",
          "COMPLETED"
        )
      ).toBe(true);
    }
  );

  test(
    "NOT_STARTED should not directly complete",
    () => {
      expect(
        isValidTransition(
          "NOT_STARTED",
          "COMPLETED"
        )
      ).toBe(false);
    }
  );

  test(
    "COMPLETED should not move backward",
    () => {
      expect(
        isValidTransition(
          "COMPLETED",
          "IN_PROGRESS"
        )
      ).toBe(false);
    }
  );
});