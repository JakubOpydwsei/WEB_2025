import { test } from '@playwright/test';

test('Task as admin', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('admin');
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('zaq12wsx');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Projects' }).click();
  await page.getByRole('link', { name: 'Add new project' }).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('TestProject');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('test');
  await page.getByRole('button', { name: 'Add project' }).click();
  await page.getByRole('button', { name: 'Set as Active' }).click();
  await page.getByRole('button', { name: 'Add Story' }).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('TestStory');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('test');
  await page.getByLabel('Priority:').selectOption('medium');
  await page.getByLabel('Status:').selectOption('doing');
  await page.getByRole('button', { name: 'Add story' }).click();
  await page.getByRole('link', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: 'Add new Task' }).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('First');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('test');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('10');
  await page.getByRole('button', { name: 'Add Task' }).click();
  await page.getByRole('button', { name: 'Add new Task' }).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('Second');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('test');
  await page.getByLabel('Priority:').selectOption('high');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('30');
  await page.locator('#user').selectOption('3');
  await page.getByRole('button', { name: 'Add Task' }).click();
  await page.getByRole('button', { name: 'Mark as done' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Name: FirstDesc: testPriority' }).getByRole('link').click();
  await page.locator('#user').selectOption('1');
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('Third');
  await page.getByRole('button', { name: 'Edit Task' }).click();
  await page.getByRole('button', { name: 'Delete' }).first().click();
  await page.getByRole('button', { name: 'Delete' }).first().click();
  await page.getByRole('button', { name: 'Projects' }).click();
  await page.getByRole('button', { name: 'Change active project !' }).click();
  await page.getByRole('button', { name: 'Set as Active' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('link', { name: 'Projects' }).click();
  await page.getByRole('button', { name: 'Change active project !' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.close();
});