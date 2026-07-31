import { test, expect } from '@playwright/test'

test('shows the tickets workspace and allows filtering', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.getByRole('link', { name: 'Tickets' }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'Tickets' })).toBeVisible()
  await expect(page.getByText('Active incident queue')).toBeVisible()
  await expect(page.getByText('API gateway latency spike')).toBeVisible()

  await page.getByPlaceholder('Search tickets or service').fill('gateway')
  await expect(page.getByText('API gateway latency spike')).toBeVisible()
  await expect(page.getByText('Database failover review')).not.toBeVisible()
})
